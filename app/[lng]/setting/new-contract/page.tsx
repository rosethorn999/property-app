"use client";

import selections from "../../../../public/selections.json";
import zipCode from "../../../../public/twZipCode.json";
import Image from "next/image";
import basicRequest from "@/app/apis/api";
import { useTranslation } from "@/app/i18n/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import DatePick from "../../components/DatePick";
import Swal from "sweetalert2";
import TextBox from "../../components/TextBox";
import Button from "@/app/[lng]/components/Button";
import Cookies from "js-cookie";
import {
  calcProductLife,
  calcProductPrice,
  isDateValid,
} from "@/app/utils/contract";
import { Product, User } from "../../../types/type";

export default function Page({ params: { lng, id: recordId } }: any) {
  const { t } = useTranslation(lng, "products");
  const router = useRouter();
  const currency = "NTD";
  const selection = {
    gym_types: selections[0].list,
    features: selections[1].list,
    zipCode,
  };
  const [districts, setDistricts] = useState<any[]>([]);
  const [price, setPrice] = useState(0);
  const [productLife, setProductLife] = useState("");
  function loadDistrictList(county: string) {
    let ret: any[] = [];
    let selectedDistricts = selection.zipCode.filter((item) => {
      return item.name === county;
    });

    if (selectedDistricts.length > 0) {
      ret = selectedDistricts[0].districts;
    }
    setDistricts(ret);
  }
  const validate = (values: Product) => {
    const errors: any = {};

    if (!values.title) {
      errors.title = "Required";
    }
    if (values.monthly_rental === 0) {
      errors.monthly_rental = "Required";
    } else if (values.monthly_rental > 10000) {
      errors.monthly_rental = "Invalid monthly_rental";
    }
    if (!selection.gym_types.map((o) => o.val).includes(values.gym_type)) {
      errors.gym_type = "Required";
    }
    if (!values.store) {
      errors.store = "Required";
    }
    if (!selection.zipCode.map((o) => o.name).includes(values.county)) {
      errors.county = "Required";
    }
    if (!districts.map((o) => o.name).includes(values.district)) {
      errors.district = "Required";
    }
    if (!isDateValid(values.expiry_date)) {
      errors.expiry_date = "Required";
    }
    if (values.monthly_rental <= 0) {
      errors.monthly_rental = "Invalid monthly_rental";
    }
    if (values.processing_fee > 10000) {
      errors.processing_fee = "Invalid processing_fee";
    }

    return errors;
  };
  const initialValues: Product = {
    id: "",
    creator: {} as User,
    modify_time: "",

    title: "",
    monthly_rental: 0,
    processing_fee: 0,
    expiry_date: "",
    description: "",
    create_time: "",
    county: "",
    district: "",
    gym_type: -1,
    store: "",
    inventory: 1,
    features: [],

    price: 0,
    stock: 0,
    picture: "",
  };
  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: (values) => {
      createContract(values);
    },
  });
  useEffect(() => {
    const p = calcProductPrice(
      formik.values.expiry_date,
      formik.values.monthly_rental,
      formik.values.processing_fee
    );
    setPrice(p);
  }, [
    formik.values.monthly_rental,
    formik.values.expiry_date,
    formik.values.processing_fee,
  ]);
  useEffect(() => {
    if (districts.length > 0) {
      formik.setFieldValue("district", districts[0].name);
      formik.validateField("district");
    }
  }, [districts]);
  async function createContract(values: any) {
    try {
      const user_id = Cookies.get("user_id");
      const url = `/users/${user_id}/products`;
      const {
        data: { id },
      } = await basicRequest.post(url, values);
      const msg = `${values.title} 已經建立`;
      await Swal.fire("完成", msg, "success");
      router.push(`/${lng}/products/${id}`);
    } catch (error: any) {
      let msg = "";
      const statusCode: number = error.response.status;
      const title = statusCode.toString();
      Swal.fire(title, msg, "error");
      console.error(error);
    }
  }
  return (
    <div className="recordDetail bg-white">
      <div className="h-full p-5 md:py-0">
        <form
          onSubmit={formik.handleSubmit}
          className="contract-container mb-24 md:mb-48"
        >
          <div className="upper-box mb-24 flex w-full flex-col gap-4 md:flex-row md:gap-24">
            <div className="left-box flex w-full flex-col gap-4 md:w-2/5">
              <TextBox
                name="title"
                extraClass={`mb-8 w-full text-4xl`}
                isInvalid={"title" in formik.errors}
                placeholder={t("title")}
                onChange={formik.handleChange}
                value={formik.values.title}
              />
              <Image
                className="main-image w-full rounded-3xl border border-whisper"
                src="/500x300.png"
                alt="mainPic"
                width="500"
                height="300"
              />
            </div>
            <div className="right-box flex w-full flex-col gap-7 md:w-3/5">
              <div>
                <h5 className="text-lg font-medium">{t("storeName")}</h5>
                <div className="mb-2 flex flex-col gap-2 text-2xl md:flex-row">
                  <select
                    value={formik.values.gym_type}
                    name="gym_type"
                    className={`mr-2 w-full rounded-3xl border-2 bg-white px-2 text-center shadow-dodgerBlueWith25Opacity focus-visible:outline-none md:w-1/2 ${
                      "gym_type" in formik.errors
                        ? "border-bloodred focus:border-bloodredWith25Opacity"
                        : "border-whisper focus:border-mayaBlue"
                    }`}
                    onChange={({ target: { value } }) => {
                      formik.setFieldValue("gym_type", parseInt(value));
                    }}
                  >
                    <option value={-1} disabled>
                      {t("Membership")}
                    </option>
                    {selection.gym_types.map(({ val, name }) => (
                      <option key={val} value={val}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <TextBox
                    name="store"
                    type="text"
                    extraClass={`w-1/2`}
                    isInvalid={"store" in formik.errors}
                    placeholder={t("storeName")}
                    onChange={formik.handleChange}
                    value={formik.values.store}
                  />
                </div>
                <div className="flex flex-col gap-2 text-lg md:flex-row">
                  <select
                    name="county"
                    value={formik.values.county}
                    onChange={({ target: { value } }) => {
                      loadDistrictList(value);
                      formik.setFieldValue("county", value);
                    }}
                    className={`w-full rounded-3xl border-2 bg-white p-2 text-center md:w-1/2 ${
                      "county" in formik.errors
                        ? "border-bloodred focus:border-bloodredWith25Opacity"
                        : "border-whisper focus:border-mayaBlue"
                    }`}
                  >
                    <option value={-1} disabled>
                      {t("County")}
                    </option>
                    {selection.zipCode.map((o) => (
                      <option key={o.name}>{o.name}</option>
                    ))}
                  </select>
                  <select
                    name="district"
                    value={formik.values.district}
                    onChange={formik.handleChange}
                    className={`w-full rounded-3xl border-2 bg-white p-2 text-center md:w-1/2 ${
                      "district" in formik.errors
                        ? "border-bloodred focus:border-bloodredWith25Opacity"
                        : "border-whisper focus:border-mayaBlue"
                    }`}
                  >
                    <option value={-1} disabled>
                      {t("District")}
                    </option>
                    {districts.map((district) => {
                      return (
                        <option
                          key={`${district.zip}-${district.name}`}
                          value={district.name}
                        >
                          {district.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="contract-date-block">
                <h5 className="text-lg font-medium">
                  {t("expiryDate")} ({productLife}):
                </h5>
                <h4 className="text-2xl">
                  <DatePick
                    lng={lng}
                    // name="expiry_date"
                    isInvalid={"expiry_date" in formik.errors}
                    handleDateChange={(v: string) => {
                      formik.setFieldValue("expiry_date", v);
                      const productLife = calcProductLife(v, t);
                      setProductLife(productLife);
                    }}
                  />
                </h4>
              </div>

              {/* <p>
								場館特色:{' '}
								{selection.features.map(
									(o) => features.some((f) => f === o.val) && <span key={o.val}>{o.name} </span>
								)}
							</p> */}
              <div className="contract-price">
                <h5 className="text-lg font-medium">{t("price")}</h5>
                <h6 className="blue text-3xl font-medium text-dodgerBlue">
                  {currency} ${price}
                </h6>
                <p className="gray font-medium text-nightRider">
                  {t("monthlyRentalFee")}:&nbsp;
                  <TextBox
                    name="monthly_rental"
                    type="number"
                    extraClass={`w-auto`}
                    isInvalid={"monthly_rental" in formik.errors}
                    placeholder={t("monthly_rental")}
                    onChange={formik.handleChange}
                    value={formik.values.monthly_rental}
                  />
                </p>
                <p className="gray font-medium text-nightRider">
                  {t("processingFee")}:{" "}
                  <TextBox
                    name="processing_fee"
                    type="number"
                    extraClass={`w-auto`}
                    isInvalid={"processing_fee" in formik.errors}
                    placeholder={t("processing_fee")}
                    onChange={formik.handleChange}
                    value={formik.values.processing_fee}
                  />
                </p>
              </div>
              <div>
                <h5 className="text-lg font-medium">{t("description")}</h5>
                <div className="description h-fit text-sm">
                  <textarea
                    rows={4}
                    className="w-full rounded-3xl border-2 border-whisper p-4  shadow-dodgerBlueWith25Opacity focus:border-mayaBlue focus-visible:outline-none"
                    name="description"
                    placeholder="..."
                    onChange={formik.handleChange}
                    value={formik.values.description}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div className="button-box text-center">
            <Button color="pink" type="button" onClick={() => router.back()}>
              {t("Cancel")}
            </Button>
            &nbsp;
            <Button type="submit" disabled={!formik.isValid}>
              {t("Create")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
