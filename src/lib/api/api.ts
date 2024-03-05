/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** Body_auth_with_email_code */
export interface BodyAuthWithEmailCode {
	/** Grant Type */
	grant_type?: string | null;
	/** Username */
	username: string;
	/** Password */
	password: string;
	/**
	 * Scope
	 * @default ""
	 */
	scope?: string;
	/** Client Id */
	client_id?: string | null;
	/** Client Secret */
	client_secret?: string | null;
}

/** Body_auth_with_yandex_token */
export interface BodyAuthWithYandexToken {
	/** Access Token */
	access_token: string;
	/** Token Type */
	token_type: string;
	/** Expires In */
	expires_in: string;
}

/** Body_upload_music */
export interface BodyUploadMusic {
	/**
	 * Music
	 * Файл музыки
	 * @format binary
	 */
	music: File;
}

/** HTTPValidationError */
export interface HTTPValidationError {
	/** Detail */
	detail?: ValidationError[];
}

/**
 * MusicOut
 * Полная схема музыки для отображения
 */
export interface MusicOut {
	/**
	 * Url
	 * Ссылка на музыку (s3 pre-signed URL)
	 */
	url: string;
	/**
	 * Duration Seconds
	 * Длительность музыки в секундах
	 */
	duration_seconds: number;
	/**
	 * Bpm
	 * BPM музыки определенный автоматически
	 */
	bpm: number | null;
	/**
	 * Custom Bpm
	 * BPM музыки установленный пользователем
	 */
	custom_bpm?: number | null;
}

/**
 * ProjectBase
 * Базовая схема для проекта
 */
export interface ProjectBase {
	/**
	 * Name
	 * Название проекта
	 */
	name?: string | null;
	/**
	 * Description
	 * Описание проекта
	 */
	description?: string | null;
}

/**
 * ProjectOut
 * Полная схема для проекта для отображения
 */
export interface ProjectOut {
	/**
	 * Name
	 * Название проекта
	 */
	name?: string | null;
	/**
	 * Description
	 * Описание проекта
	 */
	description?: string | null;
	/**
	 * Project Id
	 * Идентификатор проекта
	 * @format uuid4
	 */
	project_id: string;
	/**
	 * Texts
	 * Варианты текста
	 * @default []
	 */
	texts?: TextVariantCompact[];
	/** Музыкальный трек */
	music?: MusicOut | null;
}

/**
 * TextVariant
 * Полная схема для варианта текста для получения проекта
 */
export interface TextVariant {
	/**
	 * Name
	 * Название варианта текста
	 */
	name?: string | null;
	/**
	 * Text Id
	 * Идентификатор варианта текста
	 * @format uuid4
	 */
	text_id: string;
	/**
	 * Text
	 * Текст
	 */
	text: string;
}

/**
 * TextVariantCompact
 * Схема для варианта текста при отображении в списке проектов
 */
export interface TextVariantCompact {
	/**
	 * Name
	 * Название варианта текста
	 */
	name?: string | null;
	/**
	 * Text Id
	 * Идентификатор варианта текста
	 * @format uuid4
	 */
	text_id: string;
}

/**
 * TextVariantIn
 * Схема для варианта текста при создании
 */
export interface TextVariantIn {
	/**
	 * Name
	 * Название варианта текста
	 */
	name?: string | null;
	/**
	 * Project Id
	 * Идентификатор проекта
	 * @format uuid4
	 */
	project_id: string;
}

/**
 * TextVariantWithoutID
 * Схема для варианта текста для изменения
 */
export interface TextVariantWithoutID {
	/**
	 * Name
	 * Название варианта текста
	 */
	name?: string | null;
	/**
	 * Text
	 * Текст
	 */
	text?: string | null;
}

/** Token */
export interface Token {
	/** Access Token */
	access_token: string;
	/** Token Type */
	token_type: string;
}

/** User */
export interface User {
	/**
	 * Email
	 * @format email
	 */
	email: string;
}

/** ValidationError */
export interface ValidationError {
	/** Location */
	loc: (string | number)[];
	/** Message */
	msg: string;
	/** Error Type */
	type: string;
}

/**
 * WordMeaning
 * Схема для отображения значения слова
 */
export interface WordMeaning {
	/**
	 * Meaning
	 * Значение слова
	 */
	meaning: string;
	/**
	 * Source
	 * Источник значения слова
	 */
	source: string;
}

import { appStore } from '$lib/app-store';
import { FE_AUTH_PAGE } from '$lib/constants';
import type { AxiosInstance, AxiosRequestConfig, HeadersDefaults, ResponseType } from 'axios';
import axios from 'axios';
import * as jose from 'jose';

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
	extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
	/** set parameter to `true` for call `securityWorker` for this request */
	secure?: boolean;
	/** request path */
	path: string;
	/** content type of request body */
	type?: ContentType;
	/** query params */
	query?: QueryParamsType;
	/** format of response (i.e. response.json() -> format: "json") */
	format?: ResponseType;
	/** request body */
	body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown>
	extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
	securityWorker?: (
		securityData: SecurityDataType | null
	) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
	secure?: boolean;
	format?: ResponseType;
}

export enum ContentType {
	Json = 'application/json',
	FormData = 'multipart/form-data',
	UrlEncoded = 'application/x-www-form-urlencoded',
	Text = 'text/plain'
}

export class HttpClient<SecurityDataType = unknown> {
	public instance: AxiosInstance;
	private securityData: SecurityDataType | null = null;
	private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
	private secure?: boolean;
	private format?: ResponseType;

	constructor(
		{ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}
	) {
		this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || '' });
		this.instance.interceptors.request.use((config) => {
			const jwt = appStore.getUserToken();

			if (jwt !== null) {
				const claims = jose.decodeJwt(jwt);

				if (claims.exp === undefined || Date.now() / 1000 >= claims.exp) {
					document.location.href = FE_AUTH_PAGE;
				}

				config.headers.setAuthorization(`Bearer ${jwt}`, true);
			} else if (config.url !== undefined && !config.url.startsWith('/auth')) {
				document.location.href = FE_AUTH_PAGE;
			}
			return config;
		});

		this.secure = secure;
		this.format = format;
		this.securityWorker = securityWorker;
	}

	public setSecurityData = (data: SecurityDataType | null) => {
		this.securityData = data;
	};

	protected mergeRequestParams(
		params1: AxiosRequestConfig,
		params2?: AxiosRequestConfig
	): AxiosRequestConfig {
		const method = params1.method || (params2 && params2.method);

		return {
			...this.instance.defaults,
			...params1,
			...(params2 || {}),
			headers: {
				...((method &&
					this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) ||
					{}),
				...(params1.headers || {}),
				...((params2 && params2.headers) || {})
			}
		};
	}

	protected stringifyFormItem(formItem: unknown) {
		if (typeof formItem === 'object' && formItem !== null) {
			return JSON.stringify(formItem);
		} else {
			return `${formItem}`;
		}
	}

	protected createFormData(input: Record<string, unknown>): FormData {
		return Object.keys(input || {}).reduce((formData, key) => {
			const property = input[key];
			const propertyContent: any[] = property instanceof Array ? property : [property];

			for (const formItem of propertyContent) {
				const isFileType = formItem instanceof Blob || formItem instanceof File;
				formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
			}

			return formData;
		}, new FormData());
	}

	public request = async <T = any, _E = any>(
		{ secure, path, type, query, format, body, ...params }: FullRequestParams
	): Promise<T> => {
		const secureParams =
			((typeof secure === 'boolean' ? secure : this.secure) &&
				this.securityWorker &&
				(await this.securityWorker(this.securityData))) ||
			{};
		const requestParams = this.mergeRequestParams(params, secureParams);
		const responseFormat = format || this.format || undefined;

		if (type === ContentType.FormData && body && body !== null && typeof body === 'object') {
			body = this.createFormData(body as Record<string, unknown>);
		}

		if (type === ContentType.Text && body && body !== null && typeof body !== 'string') {
			body = JSON.stringify(body);
		}

		return this.instance
			.request({
				...requestParams,
				headers: {
					...(requestParams.headers || {}),
					...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {})
				},
				params: query,
				responseType: responseFormat,
				data: body,
				url: path
			})
			.then((response) => response.data);
	};
}

/**
 * @title Lyrics IDE Backend
 * @version 0.5.0
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
	auth = {
		/**
		 * @description Отправка письма с кодом для входа
		 *
		 * @tags Аутентификация
		 * @name SendEmailAuthCode
		 * @summary Send Email Auth Code
		 * @request POST:/auth/email
		 */
		sendEmailAuthCode: (data: User, params: RequestParams = {}) =>
			this.request<any, HTTPValidationError>({
				path: `/auth/email`,
				method: 'POST',
				body: data,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * @description Этот эндпоинт позволяет пользователю войти в систему, используя одноразовый код-пароль, отправленный на его электронную почту. Возвращает JWT токен при успешной аутентификации. В случае ошибки возвращает соответствующее сообщение об ошибке.
		 *
		 * @tags Аутентификация
		 * @name AuthWithEmailCode
		 * @summary Login For Access Token
		 * @request POST:/auth/token
		 */
		authWithEmailCode: (data: BodyAuthWithEmailCode, params: RequestParams = {}) =>
			this.request<Token, void | HTTPValidationError>({
				path: `/auth/token`,
				method: 'POST',
				body: data,
				type: ContentType.UrlEncoded,
				format: 'json',
				...params
			}),

		/**
		 * @description Получение токена для входа через Яндекс
		 *
		 * @tags Аутентификация
		 * @name AuthWithYandexToken
		 * @summary Login Via Yandex
		 * @request POST:/auth/yandex_token
		 */
		authWithYandexToken: (data: BodyAuthWithYandexToken, params: RequestParams = {}) =>
			this.request<Token, HTTPValidationError>({
				path: `/auth/yandex_token`,
				method: 'POST',
				body: data,
				type: ContentType.UrlEncoded,
				format: 'json',
				...params
			})
	};
	projects = {
		/**
		 * @description Получить список проектов
		 *
		 * @tags Проекты
		 * @name GetProjects
		 * @summary Получить список проектов
		 * @request GET:/projects/
		 * @secure
		 */
		getProjects: (params: RequestParams = {}) =>
			this.request<ProjectOut[], any>({
				path: `/projects/`,
				method: 'GET',
				secure: true,
				format: 'json',
				...params
			}),

		/**
		 * @description Создать проект
		 *
		 * @tags Проекты
		 * @name CreateProject
		 * @summary Создать проект
		 * @request POST:/projects/
		 * @secure
		 */
		createProject: (data: ProjectBase, params: RequestParams = {}) =>
			this.request<ProjectOut, HTTPValidationError>({
				path: `/projects/`,
				method: 'POST',
				body: data,
				secure: true,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * @description Получить содержимое проекта
		 *
		 * @tags Проекты
		 * @name GetProject
		 * @summary Получить содержимое проекта
		 * @request GET:/projects/{project_id}
		 * @secure
		 */
		getProject: (projectId: string, params: RequestParams = {}) =>
			this.request<ProjectOut, void | HTTPValidationError>({
				path: `/projects/${projectId}`,
				method: 'GET',
				secure: true,
				format: 'json',
				...params
			}),

		/**
		 * @description Удалить проект
		 *
		 * @tags Проекты
		 * @name DeleteProject
		 * @summary Удалить проект
		 * @request DELETE:/projects/{project_id}
		 * @secure
		 */
		deleteProject: (projectId: string, params: RequestParams = {}) =>
			this.request<any, void | HTTPValidationError>({
				path: `/projects/${projectId}`,
				method: 'DELETE',
				secure: true,
				format: 'json',
				...params
			})
	};
	music = {
		/**
		 * @description Загрузка музыки в проект
		 *
		 * @tags Музыка
		 * @name UploadMusic
		 * @summary Загрузить музыку в проект
		 * @request POST:/music/{project_id}
		 * @secure
		 */
		uploadMusic: (projectId: string, data: BodyUploadMusic, params: RequestParams = {}) =>
			this.request<MusicOut, void | HTTPValidationError>({
				path: `/music/${projectId}`,
				method: 'POST',
				body: data,
				secure: true,
				type: ContentType.FormData,
				format: 'json',
				...params
			}),

		/**
		 * @description Получение музыки проекта
		 *
		 * @tags Музыка
		 * @name GetMusic
		 * @summary Получить музыку проекта
		 * @request GET:/music/{project_id}
		 * @secure
		 */
		getMusic: (projectId: string, params: RequestParams = {}) =>
			this.request<MusicOut, void | HTTPValidationError>({
				path: `/music/${projectId}`,
				method: 'GET',
				secure: true,
				format: 'json',
				...params
			}),

		/**
		 * @description Изменение пользовательского BPM у музыки
		 *
		 * @tags Музыка
		 * @name SetMusicBpm
		 * @summary Изменить BPM у музыки
		 * @request PATCH:/music/{project_id}
		 * @secure
		 */
		setMusicBpm: (
			projectId: string,
			query: {
				/**
				 * Custom Bpm
				 * Пользовательское значение BPM
				 * @exclusiveMin 0
				 */
				custom_bpm: number;
			},
			params: RequestParams = {}
		) =>
			this.request<MusicOut, void | HTTPValidationError>({
				path: `/music/${projectId}`,
				method: 'PATCH',
				query: query,
				secure: true,
				format: 'json',
				...params
			}),

		/**
		 * @description Удаление музыки из проекта
		 *
		 * @tags Музыка
		 * @name DeleteMusic
		 * @summary Удалить музыку из проекта
		 * @request DELETE:/music/{project_id}
		 * @secure
		 */
		deleteMusic: (projectId: string, params: RequestParams = {}) =>
			this.request<ProjectOut, void | HTTPValidationError>({
				path: `/music/${projectId}`,
				method: 'DELETE',
				secure: true,
				format: 'json',
				...params
			})
	};
	texts = {
		/**
		 * @description Создание варианта текста
		 *
		 * @tags Тексты
		 * @name CreateText
		 * @summary Создать вариант текста
		 * @request POST:/texts/
		 * @secure
		 */
		createText: (data: TextVariantIn, params: RequestParams = {}) =>
			this.request<TextVariant, void | HTTPValidationError>({
				path: `/texts/`,
				method: 'POST',
				body: data,
				secure: true,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * @description Получение варианта текста
		 *
		 * @tags Тексты
		 * @name GetText
		 * @summary Получить вариант текста
		 * @request GET:/texts/{text_id}
		 * @secure
		 */
		getText: (textId: string, params: RequestParams = {}) =>
			this.request<TextVariant, void | HTTPValidationError>({
				path: `/texts/${textId}`,
				method: 'GET',
				secure: true,
				format: 'json',
				...params
			}),

		/**
		 * @description Изменение варианта текста
		 *
		 * @tags Тексты
		 * @name UpdateText
		 * @summary Изменить вариант текста
		 * @request PATCH:/texts/{text_id}
		 * @secure
		 */
		updateText: (textId: string, data: TextVariantWithoutID, params: RequestParams = {}) =>
			this.request<TextVariant, void | HTTPValidationError>({
				path: `/texts/${textId}`,
				method: 'PATCH',
				body: data,
				secure: true,
				type: ContentType.Json,
				format: 'json',
				...params
			}),

		/**
		 * @description Удаление варианта текста
		 *
		 * @tags Тексты
		 * @name DeleteText
		 * @summary Удалить вариант текста
		 * @request DELETE:/texts/{text_id}
		 * @secure
		 */
		deleteText: (textId: string, params: RequestParams = {}) =>
			this.request<any, HTTPValidationError>({
				path: `/texts/${textId}`,
				method: 'DELETE',
				secure: true,
				format: 'json',
				...params
			})
	};
	words = {
		/**
		 * @description Получить значение слова
		 *
		 * @tags Слова
		 * @name GetWordMeanings
		 * @summary Получить значение слова
		 * @request GET:/words/meaning
		 * @secure
		 */
		getWordMeanings: (
			query: {
				/**
				 * Word
				 * слово
				 * @minLength 3
				 * @maxLength 33
				 */
				word: string;
			},
			params: RequestParams = {}
		) =>
			this.request<WordMeaning[], void | HTTPValidationError>({
				path: `/words/meaning`,
				method: 'GET',
				query: query,
				secure: true,
				format: 'json',
				...params
			}),

		/**
		 * @description Получить синонимы к слову
		 *
		 * @tags Слова
		 * @name GetWordSynonyms
		 * @summary Получить синонимы к слову
		 * @request GET:/words/synonyms
		 * @secure
		 */
		getWordSynonyms: (
			query: {
				/**
				 * Word
				 * слово
				 * @minLength 3
				 * @maxLength 33
				 */
				word: string;
			},
			params: RequestParams = {}
		) =>
			this.request<string[], HTTPValidationError>({
				path: `/words/synonyms`,
				method: 'GET',
				query: query,
				secure: true,
				format: 'json',
				...params
			}),

		/**
		 * @description Получить рифмующиеся слова к слову
		 *
		 * @tags Слова
		 * @name GetWordRhyming
		 * @summary Получить рифмующиеся слова к слову
		 * @request GET:/words/rhyming
		 * @secure
		 */
		getWordRhyming: (
			query: {
				/**
				 * Word
				 * слово
				 * @minLength 3
				 * @maxLength 33
				 */
				word: string;
			},
			params: RequestParams = {}
		) =>
			this.request<string[], HTTPValidationError>({
				path: `/words/rhyming`,
				method: 'GET',
				query: query,
				secure: true,
				format: 'json',
				...params
			})
	};
}
