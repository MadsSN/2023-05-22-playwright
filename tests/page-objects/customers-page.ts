import { expect, Page } from "@playwright/test";

export class CustomersPage {
  constructor(private page: Page) {}

  async add(): Promise<void> {
    await this.page.click("data-testid=btn-add-customer");
  }

  async edit(name: string): Promise<void> {
    await this.locate(name).locator("data-testid=btn-edit").click();
  }

  locate(name: string) {
    return this.page.locator("[data-testid=row-customer]", { hasText: name });
  }

  async assertRowCount(count: number) {
    await expect(this.page.locator("data-testid=row-customer")).toHaveCount(
      count
    );
  }
}
