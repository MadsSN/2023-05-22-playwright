export type ConfigurationFeatures = {
  mockHolidays: boolean;
  mockCustomers: boolean;
  useTestid: boolean;
};

export class Configuration {
  #baseUrl: string;
  #mockCustomers: boolean;
  #mockHolidays: boolean;
  #useTestid: boolean;

  #storageKey = 'eternal-configuration';

  constructor(
    baseUrl: string,
    mockCustomers = true,
    mockHolidays = true,
    useTestid = true
  ) {
    this.#baseUrl = baseUrl;
    const values = { mockCustomers, mockHolidays, useTestid };
    const savedValues = JSON.parse(
      localStorage.getItem(this.#storageKey) || '{}'
    );
    Object.assign(values, savedValues);

    this.#mockCustomers = values.mockCustomers;
    this.#mockHolidays = values.mockHolidays;
    this.#useTestid = values.useTestid;
  }

  get baseUrl() {
    return this.#baseUrl;
  }

  get mockCustomers() {
    return this.#mockCustomers;
  }
  set mockCustomers(value: boolean) {
    this.#mockCustomers = value;
    this.#syncToLocalStorage();
  }
  get mockHolidays() {
    return this.#mockHolidays;
  }

  set mockHolidays(value: boolean) {
    this.#mockHolidays = value;
    this.#syncToLocalStorage();
  }

  get useTestid() {
    return this.#useTestid;
  }
  set useTestid(value: boolean) {
    this.#useTestid = value;
    this.#syncToLocalStorage();
  }

  updateFeatures(configurationFeatures: ConfigurationFeatures) {
    const { mockHolidays, mockCustomers, useTestid } = configurationFeatures;
    this.#useTestid = useTestid;
    this.#mockHolidays = mockHolidays;
    this.#mockCustomers = mockCustomers;

    localStorage.setItem(
      this.#storageKey,
      JSON.stringify(configurationFeatures)
    );
  }
}
