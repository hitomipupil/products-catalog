import { apiService } from "./api-calls/apiService.js";

export const renderPageBase = () => {
const app = document.createElement("div");

const appTitle = document.createElement("h1");
appTitle.textContent = "My Product Catalog";

const sidebar = document.createElement("aside");
sidebar.id = "sidebar";
const sidebarH1 = document.createElement("h3");
sidebarH1.textContent =  "Filters";
sidebar.appendChild(sidebarH1);

const categoryFilter = document.createElement("div");
categoryFilter.id = "categoryFilter";
categoryFilter.textContent = "Category";

const categorySelector = document.createElement("select");
categorySelector.id = "categorySelector";
const options = [
    {value: "categoryA", name: "CategoryA"},
    {value: "categoryB", name: "CategoryB"},
    {value: "categoryC", name: "CategoryC"},
    {value: "categoryD", name: "CategoryD"}
]

options.map((option) => {
    const categoryOption = document.createElement("option");
    categoryOption.value = option.value;
    categoryOption.innerHTML = option.name;
    categorySelector.appendChild(categoryOption);
})

const mainContainer = document.createElement("div");
mainContainer.id = "mainContainer";


categoryFilter.appendChild(categorySelector);
sidebar.appendChild(categoryFilter);
app.appendChild(appTitle);
app.appendChild(sidebar);
app.appendChild(mainContainer);
document.body.appendChild(app);

apiService();

}

renderPageBase();