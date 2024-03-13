<script lang="ts">
	import { onMount } from 'svelte';
	import { FE_AUTH_PAGE, FE_BASE_URL } from '$lib/api/constants.js';
	import SendArrow from '~icons/fluent/send-20-filled';
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
	import { Toaster } from '$lib/components/ui/sonner';
	import { mode } from 'mode-watcher';
	import { createLocalStorageStore, CURRENT_TOKEN_KEY } from '$lib/stores/localStorage';

	let authToken = createLocalStorageStore(CURRENT_TOKEN_KEY, '');

	export const formSchema = z.object({
		email: z.string().min(1).max(64).email('Неверный email'),
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
		if ($authToken !== '') {
			window.location.href = FE_BASE_URL + '/projects';
			return;
		}

		if ('YaAuthSuggest' in window) {
			try {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				let initResult = await (window.YaAuthSuggest as any).init(
					{
						client_id: '404ab7886ee84710b17d84490de832c2',
						response_type: 'token',
						redirect_uri: FE_AUTH_PAGE + '/yandex_id'
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
					authToken.set(res.access_token);
					window.location.href = FE_BASE_URL + '/projects';
				} catch (e) {
					toast.error('Ошибка при авторизации');
				}

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (error: any) {
				console.log('Что-то пошло не так: ', error);
			}
		}
	});

	let isFetching = false;
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
			let res = await api.auth.authWithEmailCode({
				username: $formData.email,
				password: $formData.code.toString()
			});
			authToken.set(res.access_token);
			window.location.href = FE_BASE_URL + '/projects';
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
								<SendArrow class="h-4 w-4" />
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
