import React from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@windmill/react-ui";
import { Scrollbars } from "react-custom-scrollbars-2";

//internal import
import Title from "@/components/form/others/Title";
import Error from "@/components/form/others/Error";
import InputArea from "@/components/form/input/InputArea";
import DrawerButton from "@/components/form/button/DrawerButton";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import useCurrencySubmit from "@/hooks/useCurrencySubmit";

const CurrencyDrawer = ({ id }) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    published,
    setPublished,
    handleSelectLanguage,
    isSubmitting,
  } = useCurrencySubmit(id);

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("UpdateCurrency")}
            description={t("UpdateCurrencyDescription")}
          />
        ) : (
          <Title
            register={register}
            handleSelectLanguage={handleSelectLanguage}
            title={t("AddCurrencyTitle")}
            description={t("AddCurrencyDescription")}
          />
        )}
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 flex-grow scrollbar-hide w-full max-h-full pb-40">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <label className="col-span-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("Name")}
              </label>
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  required={true}
                  register={register}
                  label="Currency name"
                  name="name"
                  type="text"
                  placeholder={t("CurrencyNamePlaceholder")}
                />
                <Error errorName={errors.name} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <label className="col-span-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("Code")}
              </label>
              <div className="col-span-8 sm:col-span-4">
                <Input
                  {...register("code", { required: true })}
                  name="code"
                  type="text"
                  placeholder={t("CurrencyCodePlaceholder")}
                />
                <Error errorName={errors.code} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <label className="col-span-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("Published")}
              </label>
              <div className="col-span-8 sm:col-span-4">
                <SwitchToggle handleProcess={setPublished} processOption={published} />
              </div>
            </div>
          </div>

          <DrawerButton id={id} title={t("Currency")} isSubmitting={isSubmitting} />
        </form>
      </Scrollbars>
    </>
  );
};

export default CurrencyDrawer;
