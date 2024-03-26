<script lang="ts">
	import { api } from '$lib/api';
	import { toast } from 'svelte-sonner';
	import { CopyIcon, RefreshIcon, ShareIcon, UndoIcon, BanIcon } from '$lib/components/ui/icons';
	import { Button } from '$lib/components/ui/button';
	import { Popover, PopoverContent, PopoverTrigger } from '$lib/components/ui/popover';
	import { P } from '$lib/components/ui/typography';
	import { writable, type Writable } from 'svelte/store';
	import {
		GrantLevel,
		type ProjectGrant,
		type ProjectGrantCode,
		type ProjectOut
	} from '$lib/api/api';
	import { Separator } from '$lib/components/ui/separator';
	import { BlockingSuspense } from '$lib/components/ui/blocking-suspense';
	import { getShareLink } from './utils';
	import { userInfoStore } from '$lib/stores/userInfoStore';
	import { handleApiError } from '$lib/api/utils';

	const grantLevelDisplayName: Record<GrantLevel, string> = {
		READ_WRITE: 'редактора',
		READ_ONLY: 'читателя'
	};
	const grantLevelsDisplayOrder: GrantLevel[] = [GrantLevel.READ_WRITE, GrantLevel.READ_ONLY];

	export let project: Writable<ProjectOut>;

	let users = writable<ProjectGrant[]>([]);
	let init = false;
	let loadingCodes = writable<Set<string>>(new Set());
	let codes = writable<Record<GrantLevel, ProjectGrantCode[]>>(
		grantLevelsDisplayOrder.reduce(
			(obj: Record<GrantLevel, ProjectGrantCode[]>, val: GrantLevel) => {
				obj[val] = [];
				return obj;
			},
			Object.create({})
		)
	);

	$: if ($project && !init) {
		init = true;
		(async () => {
			try {
				let res = await api.grant.getProjectCodes($project.project_id);

				codes.update((oldCodes) => {
					for (const code of res) {
						if (code.is_active) {
							oldCodes[code.level].push(code);
						}
					}
					return oldCodes;
				});

				for (const key in $codes) {
					const level: GrantLevel = key as GrantLevel;

					if ($codes[level].length === 0) {
						const newCode = await api.grant.generateProjectShareCode($project.project_id, {
							grant_level: level,
							max_activations: 1000000 // TODO: Replace constant
						});
						codes.update((oldCodes) => {
							oldCodes[level].push(newCode);
							return oldCodes;
						});
					} else if ($codes[level].length > 1) {
						let promises: Promise<any>[] = [];

						codes.update((oldCodes) => {
							while (oldCodes[level].length > 1) {
								const code = oldCodes[level].pop();
								promises.push(api.grant.deactivateProjectGrantCode(code!.grant_code_id));
							}
							return oldCodes;
						});

						await Promise.all(promises);
					}
				}
			} catch (e) {
				handleApiError(e, 'Не удалось получить ссылки для совместной работы');
			}
		})();
		(async () => {
			try {
				$users = await api.grant.getProjectUsers($project.project_id);
			} catch (e) {
				handleApiError(e, 'Не удалось загрузить пользователей документа');
			}
		})();
	}

	const refreshCode = async (code: ProjectGrantCode) => {
		try {
			loadingCodes.update((oldLoadingCodes) => {
				oldLoadingCodes.add(code.grant_code_id);
				return oldLoadingCodes;
			});

			await api.grant.deactivateProjectGrantCode(code.grant_code_id);
			let newCode = await api.grant.generateProjectShareCode($project.project_id, {
				grant_level: code.level,
				max_activations: 1000000 // TODO: Replace constant
			});

			codes.update((oldCodes) => {
				oldCodes[code.level] = oldCodes[code.level].map((val) => {
					if (val.grant_code_id === code.grant_code_id) {
						return newCode;
					}
					return val;
				});
				return oldCodes;
			});
		} catch (e) {
			handleApiError(e, 'Не удалось обновить код');
		} finally {
			loadingCodes.update((oldLoadingCodes) => {
				oldLoadingCodes.delete(code.grant_code_id);
				return oldLoadingCodes;
			});
		}
	};

	const copyLink = async (link: string) => {
		navigator.clipboard.writeText(link);
		toast('Ссылка скопирована', {
			description: 'Просто поделитесь ею для совместной работы'
		});
	};

	const getLinkPreview = (code: string) => {
		const tokens = code.split('-');
		return `/invite/${tokens[0]}...${code.slice(-3)}`;
	};

	const banUser = async (userId: string) => {
		try {
			await api.grant.revokeProjectAccess(userId, $project.project_id);

			users.update((oldUsers) =>
				oldUsers.map((user) => {
					if (user.user_id === userId) {
						user.is_active = false;
					}
					return user;
				})
			);

			toast.success('Пользователь удален', {
				duration: 10000,
				description: 'Чтобы снова добавить его в проект, пришлите ему новую ссылку доступа'
			});
		} catch (e) {
			handleApiError(e, 'Не удалось забанить пользователя');
		}
	};

	const unbanUser = async (grant: ProjectGrant) => {
		try {
			let newGrant = await api.grant.updateProjectAccess(grant.user_id, $project.project_id, {
				new_level: grant.level
			});

			users.update((oldUsers) =>
				oldUsers.map((user) => (user.user_id === grant.user_id ? newGrant : user))
			);
		} catch (e) {
			handleApiError(e, 'Не удалось вернуть пользователя в проект');
		}
	};
</script>

<Popover>
	<PopoverTrigger>
		<Button variant="ghost" size="icon"><ShareIcon class="h-5 w-5" /></Button>
	</PopoverTrigger>
	<PopoverContent class="flex min-w-72 flex-col items-start gap-4" collisionPadding={16}>
		<P class="text-l font-semibold leading-snug">Ссылки доступа</P>
		{#each grantLevelsDisplayOrder as level (level)}
			{#each $codes[level] as code (code.grant_code_id)}
				<BlockingSuspense let:suspend let:loading class="w-full">
					<div class="flex w-full items-center justify-between gap-2">
						<div class="mr-2 flex flex-col gap-1">
							<P class="text-sm font-semibold leading-tight">
								Ссылка {grantLevelDisplayName[level]}
							</P>
							<P class="text-sm leading-tight text-muted-foreground">
								{getLinkPreview(code.grant_code_id)}
							</P>
						</div>
						<div class="flex gap-1.5">
							<Button
								class="shrink-0"
								variant="outline"
								size="icon"
								on:click={() => copyLink(getShareLink($project.project_id, code.grant_code_id))}
							>
								<CopyIcon />
							</Button>
							<Button
								class="shrink-0"
								variant="outline"
								size="icon"
								on:click={() => suspend(refreshCode(code))}
							>
								<RefreshIcon class={loading && 'animate-spin-reverse'} />
							</Button>
						</div>
					</div>
				</BlockingSuspense>
			{/each}
		{/each}
		<Separator />
		<P class="text-l font-semibold leading-snug">Пользователи документа</P>
		<div class="flex w-full items-center justify-between gap-2">
			<div class="flex flex-col gap-1">
				<P class="text-sm font-semibold leading-tight">
					{#if $userInfoStore?.email}
						{$userInfoStore?.email} (Вы)
					{:else}
						Вы
					{/if}
				</P>
				<P class="text-sm leading-tight text-muted-foreground">Владелец</P>
			</div>
		</div>
		{#each $users as user (user.user_id)}
			<BlockingSuspense let:suspend class="w-full">
				<div class="flex w-full items-center justify-between gap-2">
					<div class="flex flex-col gap-1">
						<P class="text-sm font-semibold leading-tight">
							{user.user_email}
						</P>
						<P class="text-sm leading-tight text-muted-foreground">
							{#if user.is_active}
								Доступ {grantLevelDisplayName[user.level]}
							{:else}
								Забанен
							{/if}
						</P>
					</div>
					{#if user.is_active}
						<Button
							class="shrink-0"
							variant="outline"
							size="icon"
							on:click={() => suspend(banUser(user.user_id))}
						>
							<BanIcon />
						</Button>
					{:else}
						<Button
							class="shrink-0"
							variant="outline"
							size="icon"
							on:click={() => suspend(unbanUser(user))}
						>
							<UndoIcon />
						</Button>
					{/if}
				</div>
			</BlockingSuspense>
		{/each}
	</PopoverContent>
</Popover>
