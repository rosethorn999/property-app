import React from "react";
import ProductBox from "../components/ProductBox";
import SearchBox from "../components/SearchBox";
import loadingGif from "../../../public/loading.gif";
import { getContracts } from "../../apis/api";
import Link from "next/link";
import Image from "next/image";
import { Product } from "../../types/type";
import { useTranslation } from "../../i18n";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceFrownOpen } from "@fortawesome/free-regular-svg-icons";

const Page = async ({ params: { lng }, searchParams }: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lng, "products");
  const currentPage = Number(searchParams.page) || 1;
  const defaultPageSize = 10;

  const {
    results: products,
    count: recordCount,
  }: { results: Product[]; count: number } = await getContracts({
    page: currentPage,
    county: searchParams?.county,
    q: searchParams?.q,
  });

  return (
    <div className="products h-full w-full p-5 md:py-0">
      <div className="list-header my-2 flex flex-row flex-wrap gap-2 md:my-14">
        <SearchBox lng={lng} />
      </div>
      <div className="contract-container flex flex-wrap gap-12">
        {products === null ? (
          <div>
            <Image src={loadingGif} alt="loading" />
          </div>
        ) : null}

        {products?.length === 0 ? (
          <div className="w-full text-center">
            {t("empty")} <FontAwesomeIcon size="lg" icon={faFaceFrownOpen} />
          </div>
        ) : (
          products?.map((r: Product, i: number) => {
            return (
              <Link
                key={r.id}
                className="w-full"
                href={`/${lng}/products/${r.id}`}
              >
                <ProductBox r={r} lng={lng} />
              </Link>
            );
          })
        )}
        <div className="pagination-block mt-12 h-24 w-full text-center">
          <Link
            href={`/${lng}/products?page=${currentPage - 1}`}
            className={`pagination-btn mx-2 border border-whisper px-6 py-2 text-navyBlue opacity-70 hover:opacity-100 md:mx-12 ${
              currentPage <= 1 && "pointer-events-none cursor-not-allowed"
            }`}
          >
            {t("prevPage")}
          </Link>
          <Link
            href={`/${lng}/products?page=${currentPage + 1}`}
            className={`pagination-btn mx-2 border border-whisper px-6 py-2 text-navyBlue opacity-70 hover:opacity-100 md:mx-12 ${
              currentPage * defaultPageSize > recordCount &&
              "pointer-events-none cursor-not-allowed"
            }`}
          >
            {t("nextPage")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;
export const revalidate = 3600;
