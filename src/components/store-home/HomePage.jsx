import { Button, WindmillContext } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { FiSettings } from "react-icons/fi";
import { useContext } from "react";

//internal import
import Error from "@/components/form/others/Error";
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import Uploader from "@/components/image-uploader/Uploader";
import InputAreaTwo from "@/components/form/input/InputAreaTwo";
import SwitchToggle from "@/components/form/switch/SwitchToggle";

const HomePage = ({
  register,
  errors,
  headerLogo,
  setHeaderLogo,
  footerLogo,
  setFooterLogo,
  paymentImage,
  setPaymentImage,
  isSave,
  isSubmitting,
  setFooterBlock1,
  footerBlock1,
  setFooterBlock2,
  footerBlock2,
  setFooterBlock3,
  footerBlock3,
  setFooterBlock4,
  footerBlock4,
  setFooterSocialLinks,
  footerSocialLinks,
  setFooterPaymentMethod,
  footerPaymentMethod,
  setFooterBottomContact,
  footerBottomContact,
  setCategoriesMenuLink,
  categoriesMenuLink,
  setAboutUsMenuLink,
  aboutUsMenuLink,
  setContactUsMenuLink,
  contactUsMenuLink,
  setOffersMenuLink,
  offersMenuLink,
  setFaqMenuLink,
  faqMenuLink,
  setPrivacyPolicyMenuLink,
  privacyPolicyMenuLink,
  setTermsConditionsMenuLink,
  termsConditionsMenuLink,
}) => {
  const { mode } = useContext(WindmillContext);
  const { t } = useTranslation();

  return (
    <>
      <div className="sticky top-0 z-20 flex justify-end">
        {isSubmitting ? (
          <Button disabled={true} type="button" className="h-10 px-6">
            <img
              src={spinnerLoadingImage}
              alt="Loading"
              width={20}
              height={10}
            />{" "}
            <span className="font-serif ml-2 font-light">
              {" "}
              {t("Processing")}
            </span>
          </Button>
        ) : (
          <Button type="submit" className="h-10 px-6 ">
            {" "}
            {isSave ? t("SaveBtn") : t("UpdateBtn")}
          </Button>
        )}
      </div>
      <div className="grid grid-cols-12 font-sans pr-4">
        {/*  ====================================================== Header ====================================================== */}
        <div className="col-span-12 md:col-span-12 lg:col-span-12">
          <div className="inline-flex md:text-lg text-base text-gray-800 font-semibold dark:text-gray-400 mb-3">
            <FiSettings className="mt-1 mr-2" />
            {t("Header")}
          </div>

          <hr className="md:mb-6 mb-3" />

          <div className="flex-grow scrollbar-hide w-full max-h-full xl:px-10">
            <div className="inline-flex md:text-base text-sm my-3 text-gray-500 dark:text-gray-400">
              <strong>{t("HeaderContacts")}</strong>
            </div>
            <hr className="md:mb-12 mb-3" />

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("HeaderText")}
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label={t("HeaderText")}
                  name="help_text"
                  type="text"
                  placeholder={t("weAreAvailable")}
                />
                <Error errorName={errors.help_text} />
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("PhoneNumber")}
              </label>
              <div className="sm:col-span-4">
                <InputAreaTwo
                  register={register}
                  label={t("PhoneNumber")}
                  name="phone_number"
                  type="text"
                  placeholder="+01234560352"
                />
                <Error errorName={errors.phone_number} />
              </div>
            </div>
            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
              <label className="block md:text-sm  md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("HeaderLogo")}
              </label>
              <div className="sm:col-span-4">
                <Uploader
                  imageUrl={headerLogo}
                  setImageUrl={setHeaderLogo}
                  targetWidth={87}
                  targetHeight={25}
                />
              </div>
            </div>
          </div>

          {/*  ================= Menu Editor ======================== */}
          <div className="grid md:grid-cols-5 sm:grid-cols-6 scrollbar-hide w-full max-h-full pb-0">
            <div className="md:col-span-1 sm:col-span-2"></div>
            <div className="sm:col-span-4 md:pl-3 sm:pl-2">
              <div className="inline-flex md:text-base text-sm mb-3 text-gray-500 dark:text-gray-400 relative">
                <strong>{t("MenuEditor")}</strong>
              </div>

              <hr className="md:mb-12 mb-3" />

              <div className="grid grid-cols-12 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <div className="col-span-4">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {t("Categories")}
                  </label>
                  <InputAreaTwo
                    register={register}
                    label={t("Categories")}
                    name="categories"
                    type="text"
                    placeholder={t("Categories")}
                  />
                  <Error errorName={errors.categories} />
                </div>
                <div className="col-span-4">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {t("AboutUs")}
                  </label>
                  <InputAreaTwo
                    register={register}
                    label={t("AboutUs")}
                    name="about_us"
                    type="text"
                    placeholder={t("AboutUs")}
                  />
                  <Error errorName={errors.about_us} />
                </div>
                <div className="col-span-4">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {t("ContactUs")}
                  </label>
                  <InputAreaTwo
                    register={register}
                    label={t("ContactUs")}
                    name="contact_us"
                    type="text"
                    placeholder={t("ContactUs")}
                  />
                  <Error errorName={errors.contact_us} />
                </div>
                <div className="col-span-4">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {t("Offers")}
                  </label>
                  <InputAreaTwo
                    register={register}
                    label={t("Offers")}
                    name="offers"
                    type="text"
                    placeholder={t("Offers")}
                  />
                  <Error errorName={errors.offers} />
                </div>
                <div className="col-span-4">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {t("FAQ")}
                  </label>
                  <InputAreaTwo
                    register={register}
                    label={t("FAQ")}
                    name="faq"
                    type="text"
                    placeholder={t("FAQ")}
                  />
                  <Error errorName={errors.faq} />
                </div>
                <div className="col-span-4">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {t("PrivacyPolicy")}
                  </label>
                  <InputAreaTwo
                    register={register}
                    label={t("PrivacyPolicy")}
                    name="privacy_policy"
                    type="text"
                    placeholder={t("PrivacyPolicy")}
                  />
                  <Error errorName={errors.privacy_policy} />
                </div>
                <div className="col-span-4">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {t("TermsConditions")}
                  </label>
                  <InputAreaTwo
                    register={register}
                    label={t("TermsConditions")}
                    name="term_and_condition"
                    type="text"
                    placeholder={t("TermsConditions")}
                  />
                  <Error errorName={errors.term_and_condition} />
                </div>
                <div className="col-span-4">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {t("Pages")}
                  </label>
                  <InputAreaTwo
                    register={register}
                    label={t("Pages")}
                    name="pages"
                    type="text"
                    placeholder={t("Pages")}
                  />
                  <Error errorName={errors.pages} />
                </div>
                <div className="col-span-4">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {t("MyAccount")}
                  </label>
                  <InputAreaTwo
                    register={register}
                    label={t("MyAccount")}
                    name="my_account"
                    type="text"
                    placeholder={t("MyAccount")}
                  />
                  <Error errorName={errors.my_account} />
                </div>
                <div className="col-span-4">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {t("Login")}
                  </label>
                  <InputAreaTwo
                    register={register}
                    label={t("Login")}
                    name="login"
                    type="text"
                    placeholder={t("Login")}
                  />
                  <Error errorName={errors.login} />
                </div>
                <div className="col-span-4">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {t("Logout")}
                  </label>
                  <InputAreaTwo
                    register={register}
                    label={t("Logout")}
                    name="logout"
                    type="text"
                    placeholder={t("Logout")}
                  />
                  <Error errorName={errors.logout} />
                </div>
                <div className="col-span-4">
                  <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    {t("CheckOut")}
                  </label>
                  <InputAreaTwo
                    register={register}
                    label={t("CheckOut")}
                    name="checkout"
                    type="text"
                    placeholder={t("CheckOut")}
                  />
                  <Error errorName={errors.checkout} />
                </div>
              </div>

              <div className="grid xl:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <div>
                  <h4 className="font-medium font-serif md:text-base text-sm mb-2 dark:text-gray-300">
                    {t("Categories")}
                  </h4>

                  <SwitchToggle
                    title={""}
                    handleProcess={setCategoriesMenuLink}
                    processOption={categoriesMenuLink}
                  />
                </div>
                <div>
                  <h4 className="font-medium font-serif md:text-base text-sm mb-2 dark:text-gray-300">
                    {t("AboutUs")}
                  </h4>

                  <SwitchToggle
                    title={""}
                    handleProcess={setAboutUsMenuLink}
                    processOption={aboutUsMenuLink}
                  />
                </div>
                <div>
                  <h4 className="font-medium font-serif md:text-base text-sm mb-2 dark:text-gray-300">
                    {t("ContactUs")}
                  </h4>

                  <SwitchToggle
                    title={""}
                    handleProcess={setContactUsMenuLink}
                    processOption={contactUsMenuLink}
                  />
                </div>
                <div>
                  <h4 className="font-medium font-serif md:text-base text-sm mb-2 dark:text-gray-300">
                    {t("Offers")}
                  </h4>

                  <SwitchToggle
                    title={""}
                    handleProcess={setOffersMenuLink}
                    processOption={offersMenuLink}
                  />
                </div>
                <div>
                  <h4 className="font-medium font-serif md:text-base text-sm mb-2 dark:text-gray-300">
                    {t("FAQ")}
                  </h4>

                  <SwitchToggle
                    title={""}
                    handleProcess={setFaqMenuLink}
                    processOption={faqMenuLink}
                  />
                </div>
                <div>
                  <h4 className="font-medium font-serif md:text-base text-sm mb-2 dark:text-gray-300">
                    {t("PrivacyPolicy")}
                  </h4>

                  <SwitchToggle
                    title={""}
                    handleProcess={setPrivacyPolicyMenuLink}
                    processOption={privacyPolicyMenuLink}
                  />
                </div>
                <div>
                  <h4 className="font-medium font-serif md:text-base text-sm mb-2 dark:text-gray-300">
                    {t("TermsConditions")}
                  </h4>

                  <SwitchToggle
                    title={""}
                    handleProcess={setTermsConditionsMenuLink}
                    processOption={termsConditionsMenuLink}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*  ====================================================== Footer ====================================================== */}
        <div className="col-span-12 md:col-span-12 lg:col-span-12 mt-5">
          <div className="inline-flex md:text-lg text-base text-gray-800 font-semibold dark:text-gray-400 mb-3">
            <FiSettings className="mt-1 mr-2" />
            {t("Footer")}
          </div>

          <hr className="md:mb-6 mb-3" />

          <div className="flex-grow scrollbar-hide w-full max-h-full xl:px-10">
            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("FooterLogo")}
              </label>
              <div className="sm:col-span-4">
                <Uploader
                  imageUrl={footerLogo}
                  setImageUrl={setFooterLogo}
                  targetWidth={87}
                  targetHeight={25}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                {t("PaymentImage")}
              </label>
              <div className="sm:col-span-4">
                <Uploader
                  imageUrl={paymentImage}
                  setImageUrl={setPaymentImage}
                  targetWidth={200}
                  targetHeight={50}
                />
              </div>
            </div>

            <div className="grid xl:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <div>
                <h4 className="font-medium font-serif md:text-base text-sm mb-2 dark:text-gray-300">
                  {t("FooterBlock1")}
                </h4>

                <SwitchToggle
                  title={""}
                  handleProcess={setFooterBlock1}
                  processOption={footerBlock1}
                />
              </div>
              <div>
                <h4 className="font-medium font-serif md:text-base text-sm mb-2 dark:text-gray-300">
                  {t("FooterBlock2")}
                </h4>

                <SwitchToggle
                  title={""}
                  handleProcess={setFooterBlock2}
                  processOption={footerBlock2}
                />
              </div>
              <div>
                <h4 className="font-medium font-serif md:text-base text-sm mb-2 dark:text-gray-300">
                  {t("FooterBlock3")}
                </h4>

                <SwitchToggle
                  title={""}
                  handleProcess={setFooterBlock3}
                  processOption={footerBlock3}
                />
              </div>
              <div>
                <h4 className="font-medium font-serif md:text-base text-sm mb-2 dark:text-gray-300">
                  {t("FooterBlock4")}
                </h4>

                <SwitchToggle
                  title={""}
                  handleProcess={setFooterBlock4}
                  processOption={footerBlock4}
                />
              </div>
              <div>
                <h4 className="font-medium font-serif md:text-base text-sm mb-2 dark:text-gray-300">
                  {t("FooterSocialLinks")}
                </h4>

                <SwitchToggle
                  title={""}
                  handleProcess={setFooterSocialLinks}
                  processOption={footerSocialLinks}
                />
              </div>
              <div>
                <h4 className="font-medium font-serif md:text-base text-sm mb-2 dark:text-gray-300">
                  {t("FooterPaymentMethod")}
                </h4>

                <SwitchToggle
                  title={""}
                  handleProcess={setFooterPaymentMethod}
                  processOption={footerPaymentMethod}
                />
              </div>
              <div>
                <h4 className="font-medium font-serif md:text-base text-sm mb-2 dark:text-gray-300">
                  {t("FooterBottomContact")}
                </h4>

                <SwitchToggle
                  title={""}
                  handleProcess={setFooterBottomContact}
                  processOption={footerBottomContact}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
