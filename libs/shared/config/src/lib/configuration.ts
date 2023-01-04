export class Configuration {
  constructor(
    public baseUrl: string,
    public mockCustomers = true,
    public mockHolidays = true
  ) {
  }

  setMockCustomers(value: boolean) {
    this.mockCustomers = value;
  }

  setMockHolidays(value: boolean) {
    this.mockHolidays = value;
  }
}
