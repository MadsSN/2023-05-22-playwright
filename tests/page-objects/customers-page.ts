import { Page } from "@playwright/test";

export class CustomersPage {
  constructor(private page: Page) {}

  async selectCustomer(name: string) {
    await this.page
      .locator("[data-testid=row-customer]", { hasText: name })
      .locator("data-testid=btn-edit")
      .click();
  }
}
