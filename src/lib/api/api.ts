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

/**
 * CompletionIn
 * Схема куска текста для автодополнения
 */
export interface CompletionIn {
	/** Text */
	text: string;
}

/**
 * CompletionOut
 * Схема для варианта результата автодополнения текста
 */
export interface CompletionOut {
	/**
	 * Completion
	 * Продолжение текста
	 */
	completion: string;
}

/**
 * GrantLevel
 * Уровень доступа к проекту
 */
export enum GrantLevel {
	READ_WRITE = 'READ_WRITE',
	READ_ONLY = 'READ_ONLY'
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
 * ProjectGrant
 * Схема для гранта доступа к проекту
 */
export interface ProjectGrant {
	/**
	 * Grant Code Id
	 * Идентификатор гранта доступа к проекту
	 * @format uuid4
	 */
	grant_code_id: string;
	/**
	 * Project Id
	 * Идентификатор проекта
	 * @format uuid4
	 */
	project_id: string;
	/**
	 * User Id
	 * Идентификатор пользователя
	 * @format uuid4
	 */
	user_id: string;
	/**
	 * User Email
	 * Email пользователя
	 */
	user_email: string;
	/** Уровень доступа к проекту */
	level: GrantLevel;
	/**
	 * Is Active
	 * Активен ли грант доступа к проекту
	 */
	is_active: boolean;
	/**
	 * Created At
	 * Дата создания гранта
	 * @format date-time
	 */
	created_at: string;
}

/**
 * ProjectGrantCode
 * Схема для кода доступа к проекту
 */
export interface ProjectGrantCode {
	/**
	 * Grant Code Id
	 * Код доступа к проекту
	 * @format uuid4
	 */
	grant_code_id: string;
	/**
	 * Project Id
	 * Идентификатор проекта
	 * @format uuid4
	 */
	project_id: string;
	/**
	 * Issuer User Id
	 * Идентификатор пользователя, создавшего код доступа
	 * @format uuid4
	 */
	issuer_user_id: string;
	/** Уровень доступа к проекту */
	level: GrantLevel;
	/**
	 * Max Activations
	 * Максимальное количество активаций кода
	 */
	max_activations: number;
	/**
	 * Current Activations
	 * Количество активаций кода
	 */
	current_activations: number;
	/**
	 * Is Active
	 * Активен ли код доступа к проекту
	 */
	is_active: boolean;
	/**
	 * Created At
	 * Дата создания кода
	 * @format date-time
	 */
	created_at: string;
	/**
	 * Updated At
	 * Дата последнего обновления кода
	 * @format date-time
	 */
	updated_at: string;
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
	 * Owner User Id
	 * Идентификатор пользователя-владельца проекта
	 * @format uuid4
	 */
	owner_user_id: string;
	/**
	 * Is Owner
	 * Является ли текущий пользователь владельцем проекта
	 */
	is_owner: boolean;
	/** Уровень доступа к проекту. null - владелец проекта */
	grant_level: GrantLevel | null;
	/**
	 * Created At
	 * Дата создания проекта
	 * @format date-time
	 */
	created_at: string;
	/**
	 * Updated At
	 * Дата последнего обновления проекта
	 * @format date-time
	 */
	updated_at: string;
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
	 * Created At
	 * Дата создания проекта
	 * @format date-time
	 */
	created_at: string;
	/**
	 * Updated At
	 * Дата последнего обновления проекта
	 * @format date-time
	 */
	updated_at: string;
	/**
	 * Payload
	 * JSON с текстом
	 */
	payload: object;
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
	/**
	 * Created At
	 * Дата создания проекта
	 * @format date-time
	 */
	created_at: string;
	/**
	 * Updated At
	 * Дата последнего обновления проекта
	 * @format date-time
	 */
	updated_at: string;
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
	 * Payload
	 * JSON с текстом
	 */
	payload?: object | null;
}

/** Token */
export interface Token {
	/** Access Token */
	access_token: string;
	/** Token Type */
	token_type: string;
}

/**
 * UserIn
 * Схема для пользователя при создании
 */
export interface UserIn {
	/**
	 * Email
	 * Email пользователя
	 * @format email
	 */
	email: string;
}

/**
 * UserOut
 * Полная схема для пользователя для отображения
 */
export interface UserOut {
	/**
	 * Email
	 * Email пользователя
	 * @format email
	 */
	email: string;
	/**
	 * User Id
	 * Идентификатор пользователя
	 * @format uuid4
	 */
	user_id: string;
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

import type {
	AxiosInstance,
	AxiosRequestConfig,
	HeadersDefaults,
	InternalAxiosRequestConfig,
	ResponseType
} from 'axios';
import axios from 'axios';

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
	requestInterceptor?: (config: InternalAxiosRequestConfig<any>) => InternalAxiosRequestConfig<any>;
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
		{
			securityWorker,
			secure,
			format,
			requestInterceptor,
			...axiosConfig
		}: ApiConfig<SecurityDataType> = {}
	) {
		this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || '' });

		if (requestInterceptor) {
			this.instance.interceptors.request.use(requestInterceptor);
		}

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
 * @version 1.23.0
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
		sendEmailAuthCode: (data: UserIn, params: RequestParams = {}) =>
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
		 * @description Получить список проектов, на которые у пользователя есть доступ
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
		 * @description Изменить проект
		 *
		 * @tags Проекты
		 * @name UpdateProject
		 * @summary Изменить проект. Уровень доступа: владелец проекта
		 * @request PATCH:/projects/{project_id}
		 * @secure
		 */
		updateProject: (projectId: string, data: ProjectBase, params: RequestParams = {}) =>
			this.request<ProjectOut, void | HTTPValidationError>({
				path: `/projects/${projectId}`,
				method: 'PATCH',
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
		 * @description Удалить проект. Приводит к удалению всех текстов проекта, музыки, кодов доступа и прав.
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
			this.request<any, void | HTTPValidationError>({
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
	tiptap = {
		/**
		 * @description Получение JWT токена для TipTap. {"iat": <utcnow()>, "iss": "https://lyrics-backend.k8s-1.sslane.ru", "nbf": <utcnow()>, "aud": <tiptap-app-id>}
		 *
		 * @tags TipTap
		 * @name GetTiptapAccessToken
		 * @summary Get Tiptap Access Token
		 * @request GET:/tiptap/token
		 * @deprecated
		 * @secure
		 */
		getTiptapAccessToken: (params: RequestParams = {}) =>
			this.request<Token, any>({
				path: `/tiptap/token`,
				method: 'GET',
				secure: true,
				format: 'json',
				...params
			}),

		/**
		 * @description Получение JWT токена для TipTap под конкретный текст. { "iat": <utcnow()>, "iss": "https://lyrics-backend.k8s-1.sslane.ru", "nbf": <utcnow()>, "aud": <tiptap-app-id>, "allowedDocumentNames": [<text_id>], "readonlyDocumentNames": [<text_id>] # если grant_level == "READ_ONLY", иначе [] (полный доступ) }
		 *
		 * @tags TipTap
		 * @name GetTiptapToken
		 * @summary Get Tiptap Access Token V2
		 * @request GET:/tiptap/token/{text_id}
		 * @secure
		 */
		getTiptapToken: (textId: string, params: RequestParams = {}) =>
			this.request<Token, void | HTTPValidationError>({
				path: `/tiptap/token/${textId}`,
				method: 'GET',
				secure: true,
				format: 'json',
				...params
			})
	};
	completions = {
		/**
		 * @description Продолжить текст
		 *
		 * @tags Автодополнение
		 * @name CreateCompletion
		 * @summary Продолжить текст
		 * @request POST:/completions/
		 * @secure
		 */
		createCompletion: (data: CompletionIn, params: RequestParams = {}) =>
			this.request<CompletionOut[], HTTPValidationError>({
				path: `/completions/`,
				method: 'POST',
				body: data,
				secure: true,
				type: ContentType.Json,
				format: 'json',
				...params
			})
	};
	grant = {
		/**
		 * @description Получить ссылку на получение доступа к проекту
		 *
		 * @tags Доступ
		 * @name GenerateProjectShareCode
		 * @summary Получить код на получение доступа к проекту
		 * @request GET:/grant/project/{project_id}
		 * @secure
		 */
		generateProjectShareCode: (
			projectId: string,
			query: {
				/**
				 * Grant Level
				 * уровень доступа
				 */
				grant_level: GrantLevel;
				/**
				 * Max Activations
				 * максимальное количество активаций
				 * @exclusiveMin 0
				 */
				max_activations: number;
			},
			params: RequestParams = {}
		) =>
			this.request<ProjectGrantCode, void | HTTPValidationError>({
				path: `/grant/project/${projectId}`,
				method: 'GET',
				query: query,
				secure: true,
				format: 'json',
				...params
			}),

		/**
		 * @description Активировать код доступа к проекту. Проверяет наличие и активность кода, активирует в случае успеха проверок. В случае, когда пользователь активирует новый код доступа по проекту, предыдущий доступ перезаписывается.
		 *
		 * @tags Доступ
		 * @name ActivateProjectShareCode
		 * @summary Активировать код доступа к проекту
		 * @request GET:/grant/codes/activate/{grant_code_id}
		 * @secure
		 */
		activateProjectShareCode: (grantCodeId: string, params: RequestParams = {}) =>
			this.request<ProjectGrant, void | HTTPValidationError>({
				path: `/grant/codes/activate/${grantCodeId}`,
				method: 'GET',
				secure: true,
				format: 'json',
				...params
			}),

		/**
		 * @description Получить список пользователей, имеющих доступ к проекту
		 *
		 * @tags Доступ
		 * @name GetProjectUsers
		 * @summary Получить список пользователей, имеющих доступ к проекту
		 * @request GET:/grant/project/{project_id}/users
		 * @secure
		 */
		getProjectUsers: (projectId: string, params: RequestParams = {}) =>
			this.request<ProjectGrant[], void | HTTPValidationError>({
				path: `/grant/project/${projectId}/users`,
				method: 'GET',
				secure: true,
				format: 'json',
				...params
			}),

		/**
		 * @description Отозвать доступ к проекту
		 *
		 * @tags Доступ
		 * @name RevokeProjectAccess
		 * @summary Отозвать доступ к проекту
		 * @request DELETE:/grant/{project_id}/users/{user_id}
		 * @secure
		 */
		revokeProjectAccess: (userId: string, projectId: string, params: RequestParams = {}) =>
			this.request<ProjectGrant, void | HTTPValidationError>({
				path: `/grant/${projectId}/users/${userId}`,
				method: 'DELETE',
				secure: true,
				format: 'json',
				...params
			}),

		/**
		 * @description Изменить уровень доступа к проекту
		 *
		 * @tags Доступ
		 * @name UpdateProjectAccess
		 * @summary Изменить уровень доступа
		 * @request PATCH:/grant/{project_id}/users/{user_id}
		 * @secure
		 */
		updateProjectAccess: (
			userId: string,
			projectId: string,
			query: {
				/**
				 * New Level
				 * новый уровень доступа
				 */
				new_level: GrantLevel;
			},
			params: RequestParams = {}
		) =>
			this.request<ProjectGrant, void | HTTPValidationError>({
				path: `/grant/${projectId}/users/${userId}`,
				method: 'PATCH',
				query: query,
				secure: true,
				format: 'json',
				...params
			}),

		/**
		 * @description Получить список кодов доступа к проекту
		 *
		 * @tags Доступ
		 * @name GetProjectCodes
		 * @summary Получить список кодов доступа к проекту
		 * @request GET:/grant/projects/{project_id}/codes
		 * @secure
		 */
		getProjectCodes: (projectId: string, params: RequestParams = {}) =>
			this.request<ProjectGrantCode[], void | HTTPValidationError>({
				path: `/grant/projects/${projectId}/codes`,
				method: 'GET',
				secure: true,
				format: 'json',
				...params
			}),

		/**
		 * @description Деактивировать код доступа к проекту (пользователи не блокируются, только запрещается подключение новых по этой ссылке)
		 *
		 * @tags Доступ
		 * @name DeactivateProjectGrantCode
		 * @summary Деактивировать код доступа к проекту
		 * @request DELETE:/grant/codes/{grant_code_id}
		 * @secure
		 */
		deactivateProjectGrantCode: (grantCodeId: string, params: RequestParams = {}) =>
			this.request<any, void | HTTPValidationError>({
				path: `/grant/codes/${grantCodeId}`,
				method: 'DELETE',
				secure: true,
				format: 'json',
				...params
			}),

		/**
		 * @description Покинуть проект
		 *
		 * @tags Доступ
		 * @name LeaveProject
		 * @summary Покинуть проект
		 * @request DELETE:/grant/{project_id}/leave
		 * @secure
		 */
		leaveProject: (projectId: string, params: RequestParams = {}) =>
			this.request<ProjectGrant, void | HTTPValidationError>({
				path: `/grant/${projectId}/leave`,
				method: 'DELETE',
				secure: true,
				format: 'json',
				...params
			})
	};
	users = {
		/**
		 * @description Получить информацию о пользователе. Можно получить информацию только про себя.
		 *
		 * @tags Пользователи
		 * @name GetUser
		 * @summary Получить информацию о пользователе
		 * @request GET:/users/{user_id}
		 * @secure
		 */
		getUser: (userId: string, params: RequestParams = {}) =>
			this.request<UserOut, void | HTTPValidationError>({
				path: `/users/${userId}`,
				method: 'GET',
				secure: true,
				format: 'json',
				...params
			})
	};
	health = {
		/**
		 * @description Проверка живости сервиса
		 *
		 * @tags health
		 * @name GetLiveness
		 * @summary Liveness
		 * @request GET:/health/liveness
		 */
		getLiveness: (params: RequestParams = {}) =>
			this.request<any, any>({
				path: `/health/liveness`,
				method: 'GET',
				format: 'json',
				...params
			}),

		/**
		 * @description Проверка готовности сервиса принимать запросы
		 *
		 * @tags health
		 * @name GetReadiness
		 * @summary Readiness
		 * @request GET:/health/readiness
		 */
		getReadiness: (params: RequestParams = {}) =>
			this.request<any, any>({
				path: `/health/readiness`,
				method: 'GET',
				format: 'json',
				...params
			})
	};
}
