import HomePage from "./HomePage.astro";
import DefaultPage from "./DefaultPage.astro";
import ProductIndexPage from "./ProductIndexPage.astro";
import ProductShowPage from "./ProductShowPage.astro";
import ProductCategoryIndexPage from "./ProductCategoryIndexPage.astro";
import ProductCategoryShowPage from "./ProductCategoryShowPage.astro";
import NotFoundPage from "./NotFoundPage.astro";
import TemplateNotFoundPage from "./TemplateNotFoundPage.astro";

const templateComponents = {
  "@apostrophecms/home-page": HomePage,
  "default-page": DefaultPage,
  "product-page:index": ProductIndexPage,
  "product-page:show": ProductShowPage,
  "product-category-page:index": ProductCategoryIndexPage,
  "product-category-page:show": ProductCategoryShowPage,
  "@apostrophecms/page:notFound": NotFoundPage,
  "apos-no-template": TemplateNotFoundPage,
};

export default templateComponents;
