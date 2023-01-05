export class Configuration {
  constructor(
    public baseUrl: string,
    public mockCustomers = true,
    public mockHolidays = true,
    public useTestId = true
  ) {}
}
