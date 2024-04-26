import { useTranslation } from "../../../i18n";
import { ProductBase } from "./ProductBase";
import { Product } from "@/app/types/type";

async function ContractBox({
  lng,
  fitXs = false,
  r,
}: {
  lng: string;
  fitXs?: boolean;
  r: Product;
}) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lng, "products");

  return <ProductBase t={t} r={r} fitXs={fitXs} />;
}
export default ContractBox;
