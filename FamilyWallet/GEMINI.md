# Projects

## Principles
* IT projects
* Projects carried out in accordance with the rules of the SCRUM framework

# Project Family Wallet

## Project Context

### 1. Project Meta-Data
* ***Level of detail:*** *Minimal. Fill in labels only. This section serves for quick identification of the document and its currency.*
* **Version:** `[2025-09-01]`
* **Project Name:** `[Family Wallet]`
* **Elevator Pitch (one sentence):** `[A mobile application for managing a family's home budget, integrating bank accounts, savings goals, and financial education for children in one place.]`
* **Product Owner:** `[Anna Kowalska]`

### 2. 🧭 Project Compass (Main "Why?")
* ***Level of detail:*** *Strategic. Use short, strong sentences that convey the mission and objectives.*
* **Product Vision (long-term goal):** `[To create Poland’s leading digital platform for family finance management, which, thanks to personalization and educational tools, helps families build financial security and teach children good financial habits.]`

* **Main Business Goals (OKRs/KPIs per quarter/year):** `[Q1 2026: Launch MVP version with integration of the 3 largest banks and a manual expense tracking module. Q1/2026: Acquire 10,000 active families and establish a partnership with one financial blog. By end of Q2/2026: Introduce a child pocket money module and achieve 1,000 paid subscriptions.]`

* **Main User Problem Being Solved:** `[Families have scattered financial data (accounts in different banks, separate savings goals, lack of control over children's expenses), making it difficult to get a comprehensive view of their financial situation and to plan for the future. They lack a single, reliable place to manage their family's finances.]`

### 3. 💰 Business Model and Value Stream
* ***Level of detail:*** *Conceptual. Describe in a few points how the project earns money or generates value.*

* **Revenue Streams:** `[Subscription model (Freemium: basic features for free, Premium version with advanced analytics and multi-currency budgets), commission fees for financial products (e.g., loans, insurance), sale of personalized financial plans, anonymous data for the research sector (B2B).]`

* **Key Value Exchange:** `[The user pays a subscription or service fee in exchange for centralized access to their financial data, its analysis, personalized advice, and tools for children's financial education.]`
* **Operating Model (in brief):** `[SaaS (Software as a Service) platform with a mobile app for parents and children and a web panel for financial advisors.]`

### 4. 👥 Personas (Essence)
* ***Level of detail:*** *Concise essence. For each key user group, describe their role, main goal, and biggest frustration.*
* **Parent:** *cares about the family's financial security, wants to control the budget and save for the future, gets frustrated by the lack of time to manually track all expenses and by the difficulty of teaching children the value of money.*
* **Child:** *receives pocket money, wants to save for their own goals (e.g., a new toy, a game), gets irritated by a lack of understanding of how much they can spend and by losing cash.*
* **Financial Advisor:** *uses the platform to support their clients, wants a full and organized view of the family’s financial situation, gets irritated by incomplete data provided by clients.*
* **Platform Admin:** *manages the system, ensures data security and smooth platform operation, needs tools for system monitoring, user management, and solving technical problems.*

#### `[Ewa]`
* **Role:** `[Product Manager]`
* **Main Goal:** `[Deliver a product that users will love and want to pay for]`
* **Main Frustration:** `[Constant changes in banking regulations (PSD2) and the need to ensure the security of financial data.]`

#### `[Michał]`
* **Role:** `[Lead Developer]`
* **Main Goal:** `[Build a scalable and secure system architecture]`
* **Main Frustration:** `[Integration with various and often outdated banking APIs and ensuring the speed of data synchronization.]`

#### `[Joanna]`
* **Role:** `[CEO]`
* **Main Goal:** `[Make Family Wallet the FinTech market leader in Poland in the family finance category]`
* **Main Frustration:** `[Long sales cycle for partners from the financial sector and low financial literacy in society.]`

### 5. 🗺️ Main Product Modules
* ***Level of detail:*** *High-level. List 4–7 main product functional areas from the user perspective, not from a technical standpoint.*

* **[Family Dashboard]:** `[Main user interface, aggregation of data from bank accounts, manual entry of expenses, budget status, list of savings goals.]`

* **[Budgeting and Analytics Module]:** `[Visualization of spending trends, categorization of expenses, personalized alerts about exceeding the budget, financial reports.]`

* **[Child's Pocket Money Module]:** `[Module for setting up regular pocket money transfers, assigning tasks for extra money, child's savings goals, and parental control over expenses.]`

* **[Bank Integrations]:** `[API for synchronizing data with popular banks and other financial institutions (e.g., brokers, credit cards).]`

* **[Financial Education and Goals]:** `[Articles and interactive lessons on saving, setting and tracking family savings goals (e.g., for a vacation, a new car).]`

### 6. 🤝 Key Stakeholders
* ***Level of detail:*** *Influence map. List key roles or departments and their main, one-sentence interest in the project.*
* **[Users (Families)]:** `[To get a simple and effective tool for managing their home budget and teaching children about finance.]`
* **[Investors]:** `[To build a profitable business with high growth potential and achieve a return on investment.]`
* **[Financial Partners (Banks, Advisors)]:** `[To increase customer numbers, optimize work, and gain an additional source of income.]`
* **[Educational Partners (Schools, Bloggers)]:** `[To acquire new audiences and obtain a tool for practical financial education.]`
* **[Regulators (e.g., KNF, UOKiK)]:** `[To ensure the platform complies with current laws, especially in the area of financial data protection and consumer rights.]`

### 7. ✍️ Product Decision Log
* **[01.09.2025]:** `[Decision to prioritize integration with mBank and PKO BP in Sprint 12. For now, we are postponing integration with credit card systems in favor of faster implementation of the child's pocket money module.]`
* **[25.08.2025]:** `[After legal analysis, we are giving up storing login credentials for banks. The system will only use secure PSD2-compliant APIs. This reduces security risks.]`
* **[12.08.2025]:** `[Change in monetization strategy. In the Freemium model, transaction history is limited to 3 months. Full history will be available only in the paid Premium plan. This is intended to accelerate user conversion.]`
* **[15.07.2025]:** `[The MVP will not include a financial advisor consultation module. Instead, at launch we will introduce a savings goal module. Consultations will be added in Q1 2026, allowing for a faster product release.]`
* **[30.06.2025]:** `[Decision made to build our own module for financial education instead of integrating an external provider. This gives greater control over user experience and content quality.]`
* **[28.05.2025]:** `[Due to feedback from initial testers, the interface for manual entry of expenses will be completely redesigned to be more intuitive and to suggest expense categories.]`