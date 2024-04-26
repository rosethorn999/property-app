"use client";
import Image from "next/image";
import loadingGif from "../../../../public/loading.gif";
import { Product } from "@/app/types/type";
import { getMyContracts } from "@/app/apis/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceFrownOpen } from "@fortawesome/free-regular-svg-icons";
import ContractBox from "../../components/ProductBox/client";
import Link from "next/link";
import { useTranslation } from "@/app/i18n/client";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function Page({ params: { lng }, searchParams }: any) {
  const { t } = useTranslation(lng, "setting");
  const user_id = Cookies.get("user_id") as string;

  const [products, setContracts] = useState<Product[]>([]);
  const getMyContractsRequest = async (abortController: AbortController) => {
    const payload = { page: 1, user_id };
    const results = await getMyContracts(payload, abortController);
    setContracts(results);
  };
  useEffect(() => {
    const abortController = new AbortController();
    getMyContractsRequest(abortController);

    return () => abortController.abort();
  }, []);

  return (
    <>
      <div className="contract-container flex flex-wrap gap-12">
        {products === null ? (
          <div>
            <Image src={loadingGif} alt="loading" />
          </div>
        ) : null}

        {!products || products?.length === 0 ? (
          <div className="w-full text-center">
            {t("empty")} <FontAwesomeIcon size="lg" icon={faFaceFrownOpen} />
          </div>
        ) : (
          <>
            {products?.map((r: any, i: number) => {
              return (
                <Link
                  key={r.id}
                  className="w-full"
                  href={`/${lng}/products/${r.id}/update`}
                >
                  <ContractBox r={r} lng={lng} />
                </Link>
              );
            })}
            <div className="w-full text-center italic">
              {t("onlyShowFirst10Contracts")}
            </div>
          </>
        )}
      </div>
    </>
  );
}
