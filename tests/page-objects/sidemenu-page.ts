import { Page } from "@playwright/test";

export class SidemenuPage {
  constructor(private page: Page) {}

  async select(menu: "customers" | "holidays") {
    await this.page.click(`data-testid=btn-${menu}`);
  }
}
