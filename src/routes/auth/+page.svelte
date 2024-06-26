<script lang="ts">
	import { onMount } from 'svelte';
	import { FE_PROJECTS_PAGE, FE_AUTH_PAGE, FE_YANDEX_ID_PAGE } from '$lib/constants.js';
	import { SendIcon } from '$lib/components/ui/icons';
	import { Button } from '$lib/components/ui/button';
	import {
		FormDescription,
		FormFieldErrors,
		FormLabel,
		FormControl,
		FormField
	} from '$lib/components/ui/form/index.js';
	import { api } from '$lib/api';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import { Input } from '$lib/components/ui/input';
	import { H3 } from '$lib/components/ui/typography';
	import { toast } from 'svelte-sonner';
	import { mode } from 'mode-watcher';
	import { decodeJwt } from 'jose';
	import { authTokenStore } from '$lib/stores/authTokenStore';
	import { userInfoStore } from '$lib/stores/userInfoStore';
	import { handleApiError } from '$lib/api/utils';

	export const formSchema = z.object({
		email: z.string().email('Неверный email'),
		code: z.coerce.number()
	});

	const form = superForm(defaults({ code: undefined }, zod(formSchema)), {
		SPA: true,
		validators: zod(formSchema)
	});
	const { form: formData, enhance, constraints, errors } = form;

	interface YandexIdResponse {
		access_token: string;
		expires_in: string;
		token_type: string;
	}

	onMount(async () => {
		if ($authTokenStore !== '') {
			window.location.href = FE_PROJECTS_PAGE;
			return;
		}

		if ('YaAuthSuggest' in window) {
			try {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				let initResult = await (window.YaAuthSuggest as any).init(
					{
						client_id: '404ab7886ee84710b17d84490de832c2',
						response_type: 'token',
						redirect_uri: FE_YANDEX_ID_PAGE
					},
					FE_AUTH_PAGE,
					{
						view: 'button',
						parentId: 'yaButtonContainer',
						buttonView: 'main',
						buttonTheme: $mode,
						buttonSize: 's',
						buttonBorderRadius: 6
					}
				);

				let data: YandexIdResponse = await initResult.handler();

				try {
					let res = await api.auth.authWithYandexToken(data);
					authTokenStore.set(res.access_token);
					window.location.href = FE_PROJECTS_PAGE;
				} catch (e) {
					handleApiError(e, 'Ошибка при авторизации');
				}

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (error: any) {
				console.log('Что-то пошло не так: ', error);
			}
		}
	});

	let isFetching = false; // TODO: Replace this garbage with BlockingSuspense component
	let resendCodeCountdown = 0;

	let updateResendCodeCountdown = () => {
		resendCodeCountdown -= 1;
		if (resendCodeCountdown > 0) {
			setTimeout(updateResendCodeCountdown, 1000);
		}
	};

	let sendEmailCode = async () => {
		try {
			isFetching = true;
			await api.auth.sendEmailAuthCode({ email: $formData.email });
			toast.info(`Код авторизации отправлен на почту ${$formData.email}`);
			resendCodeCountdown = 60;
			updateResendCodeCountdown();
		} catch (e: unknown) {
			$errors.email = ['Неправильный email или что-то пошло не так'];
		} finally {
			isFetching = false;
		}
	};

	let confirmEmailCode = async () => {
		try {
			isFetching = true;

			const token = await api.auth.authWithEmailCode({
				username: $formData.email,
				password: $formData.code.toString()
			});

			authTokenStore.set(token.access_token);
			userInfoStore.set(await api.users.getUser(decodeJwt(token.access_token).user_id as string));

			window.location.href = FE_PROJECTS_PAGE;
		} catch (e: unknown) {
			if (typeof e === 'string') {
				$errors.code = [e as string];
			} else {
				$errors.code = ['Неверный email или код'];
			}
		} finally {
			isFetching = false;
		}
	};
</script>

<svelte:head>
	<script
		src="https://yastatic.net/s3/passport-sdk/autofill/v1/sdk-suggest-with-polyfills-latest.js"
	></script>
</svelte:head>

<div class="flex h-screen w-screen flex-col items-center justify-center">
	<div class="flex w-96 flex-col gap-4">
		<H3>Авторизация</H3>
		<form method="POST" use:enhance>
			<fieldset disabled={isFetching === true}>
				<FormField {form} name="email">
					<FormControl let:attrs>
						<FormLabel>Почта</FormLabel>
						<Input
							{...attrs}
							type="email"
							bind:value={$formData.email}
							placeholder="user@example.com"
							{...$constraints.email}
						/>
						<FormDescription />
						<FormFieldErrors />
					</FormControl>
				</FormField>
				<FormField {form} name="code">
					<FormControl let:attrs>
						<FormLabel>Код авторизации с почты</FormLabel>
						<div class="relative flex flex-row gap-2">
							<Input
								{...attrs}
								type="number"
								bind:value={$formData.code}
								placeholder="123456"
								{...$constraints.code}
							/>
							<Button
								class="flex-shrink-0"
								on:click={sendEmailCode}
								variant="outline"
								size="icon"
								disabled={resendCodeCountdown !== 0}
							>
								<SendIcon class="h-4 w-4" />
							</Button>
							{#if resendCodeCountdown !== 0}
								<div class="absolute right-[-2.75rem] flex h-9 w-9 items-center justify-center">
									<p class="text-muted-foreground">
										{resendCodeCountdown}
									</p>
								</div>
							{/if}
						</div>
						<FormDescription />
						<FormFieldErrors />
					</FormControl>
				</FormField>
				<Button class="mt-4 w-full" size="lg" on:click={confirmEmailCode}>Войти</Button>
			</fieldset>
		</form>
		<div class="flex flex-row items-center gap-4">
			<div class="h-px w-full rounded-full bg-muted-foreground" />
			или
			<div class="h-px w-full rounded-full bg-muted-foreground" />
		</div>
		<div>
			<div id="yaButtonContainer"></div>
		</div>
	</div>
</div>
