"use client";
import { ProductBase } from "./ProductBase";
import { useTranslation } from "../../../i18n/client";

const ContractBox = ({ lng, fitXs = false, r }) => {
  const { t } = useTranslation(lng, "products");
  return <ProductBase t={t} r={r} fitXs={fitXs} />;
};
export default ContractBox;
