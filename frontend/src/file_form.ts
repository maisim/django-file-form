import UploadFile, {
  Callbacks,
  InitialFile,
  Translations
} from "./upload_file";
import {
  getInputNameWithPrefix,
  getInputValueForFormAndPrefix,
  getPlaceholderFieldName
} from "./util";

interface Options {
  callbacks?: Callbacks;
  prefix?: string;
  retryDelays?: number[];
  skipRequired?: boolean;
  supportDropArea?: boolean;
}

const initUploadFields = (form: Element, options: Options = {}): void => {
  const matchesPrefix = (fieldName: string): boolean => {
    if (!(options && options.prefix)) {
      return true;
    }

    return fieldName.startsWith(`${options.prefix}-`);
  };

  const getPrefix = (): string | null =>
    options && options.prefix ? options.prefix : null;

  const getInputValue = (fieldName: string): string | undefined =>
    getInputValueForFormAndPrefix(form, fieldName, getPrefix());

  const getInitialFiles = (element: HTMLElement): InitialFile[] => {
    const filesData = element.dataset.files;

    if (!filesData) {
      return [];
    }

    return JSON.parse(filesData);
  };

  const getPlaceholders = (fieldName: string): InitialFile[] => {
    const data = getInputValue(getPlaceholderFieldName(fieldName, getPrefix()));

    if (!data) {
      return [];
    }

    return JSON.parse(data);
  };

  const uploadUrl = getInputValue("upload_url");
  const formId = getInputValue("form_id");
  const skipRequired = options.skipRequired || false;
  const prefix = getPrefix();

  if (!formId || !uploadUrl) {
    return;
  }

  form.querySelectorAll(".dff-uploader").forEach(uploaderDiv => {
    const container = uploaderDiv.querySelector(
      ".dff-container"
    ) as HTMLElement;

    if (!container) {
      return;
    }

    const input = container.querySelector(
      "input[type=file]"
    ) as HTMLInputElement;

    if (!(input && matchesPrefix(input.name))) {
      return;
    }

    const fieldName = input.name;
    const { multiple } = input;
    const initial = getInitialFiles(container).concat(
      getPlaceholders(fieldName)
    );
    const dataTranslations = container.getAttribute("data-translations");
    const translations: Translations = dataTranslations
      ? JSON.parse(dataTranslations)
      : {};
    const supportDropArea = !(options.supportDropArea === false);

    new UploadFile({
      callbacks: options.callbacks || {},
      fieldName,
      form,
      formId,
      initial,
      input,
      multiple,
      parent: container,
      prefix,
      retryDelays: options.retryDelays || null,
      skipRequired,
      supportDropArea,
      translations,
      uploadUrl
    });
  });
};

const initFormSet = (form: Element, optionsParam: Options | string): void => {
  let options: Options;

  if (typeof optionsParam === "string") {
    options = { prefix: optionsParam };
  } else {
    options = optionsParam;
  }

  const prefix = options.prefix || "form";

  const totalFormsValue = getInputValueForFormAndPrefix(
    form,
    "TOTAL_FORMS",
    prefix
  );

  if (!totalFormsValue) {
    return;
  }

  const formCount = parseInt(totalFormsValue, 10);

  for (let i = 0; i < formCount; i += 1) {
    const subFormPrefix = getInputNameWithPrefix(`${i}`, null);
    initUploadFields(form, {
      ...options,
      prefix: `${prefix}-${subFormPrefix}`
    });
  }
};

declare const global: any; // eslint-disable-line @typescript-eslint/no-explicit-any

global.initFormSet = initFormSet;
global.initUploadFields = initUploadFields;
