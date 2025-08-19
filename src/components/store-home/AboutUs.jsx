import { Button } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { FiSettings } from "react-icons/fi";
import {
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Tabs as TabsComponent,
} from "react-tabs";

//internal import

import Error from "@/components/form/others/Error";
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import InputAreaTwo from "@/components/form/input/InputAreaTwo";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import TextAreaCom from "@/components/form/others/TextAreaCom";
import UploaderWithCropper from "@/components/image-uploader/UploaderWithCropper";
import { useState } from "react";

const AboutUs = ({
  isSave,
  register,
  errors,
  control,
  setAboutHeaderBg,
  aboutHeaderBg,
  setAboutPageHeader,
  aboutPageHeader,
  setAboutTopContentLeft,
  aboutTopContentLeft,
  setAboutTopContentRight,
  aboutTopContentRight,
  setAboutTopContentRightImage,
  aboutTopContentRightImage,
  setAboutMiddleContentSection,
  aboutMiddleContentSection,
  setAboutMiddleContentImage,
  aboutMiddleContentImage,
  setOurFounderSection,
  ourFounderSection,
  setOurFounderOneImage,
  ourFounderOneImage,
  setOurFounderTwoImage,
  ourFounderTwoImage,
  setOurFounderThreeImage,
  ourFounderThreeImage,
  setOurFounderFourImage,
  ourFounderFourImage,
  setOurFounderFiveImage,
  ourFounderFiveImage,
  setOurFounderSixImage,
  ourFounderSixImage,
  // Additional founder images
  setOurFounderSevenImage,
  ourFounderSevenImage,
  setOurFounderEightImage,
  ourFounderEightImage,
  setOurFounderNineImage,
  ourFounderNineImage,
  setOurFounderTenImage,
  ourFounderTenImage,
  setOurFounderElevenImage,
  ourFounderElevenImage,
  setOurFounderTwelveImage,
  ourFounderTwelveImage,
  // Section toggles
  setAboutCoreValues,
  aboutCoreValues,
  setAboutBranches,
  aboutBranches,
  isSubmitting,
  handleSubmit,
  onSubmit,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="grid grid-cols-12 font-sans pr-4">
        <div className="col-span-12 md:col-span-12 lg:col-span-12">
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
              <Button
                type="button"
                className="h-10 px-6 "
                onClick={() => {
                  console.log("🔘 Button clicked! Testing form submission...");
                  console.log("🔍 isSave value:", isSave);
                  console.log("🔍 handleSubmit function:", typeof handleSubmit);
                  console.log("🔍 onSubmit function:", typeof onSubmit);
                  try {
                    handleSubmit(onSubmit)();
                  } catch (error) {
                    console.error("❌ Error in handleSubmit:", error);
                  }
                }}
                onMouseEnter={() => console.log("🖱️ Mouse entered button")}
                onMouseDown={() => console.log("🖱️ Mouse down on button")}
              >
                {isSave ? t("SaveBtn") : t("UpdateBtn")}
              </Button>
            )}
          </div>

          <div className="inline-flex md:text-lg text-base text-gray-800 font-semibold dark:text-gray-400 md:mb-3 mb-1">
            <FiSettings className="mt-1 mr-2" />
            {t("AboutUs")}
          </div>

          <hr className="md:mb-12 mb-3" />

          <div className="xl:px-10 flex-grow scrollbar-hide w-full max-h-full">
            <div className="inline-flex md:text-base text-sm mb-3 text-gray-500 dark:text-gray-400">
              <strong>{t("PageHeader")}</strong>
            </div>
            <hr className="md:mb-12 mb-3" />

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                {t("EnableThisBlock")}
              </label>
              <div className="sm:col-span-4">
                <SwitchToggle
                  title=""
                  handleProcess={setAboutPageHeader}
                  processOption={aboutPageHeader}
                  name={aboutPageHeader}
                />
              </div>
            </div>

            <div
              className="mb-height-0"
              style={{
                height: aboutPageHeader ? "auto" : 0,
                transition: "all 0.5s",
                visibility: !aboutPageHeader ? "hidden" : "visible",
                opacity: !aboutPageHeader ? "0" : "1",
              }}
            >
              <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                  {t("PageHeaderBg")}
                </label>
                <div className="sm:col-span-4">
                  <UploaderWithCropper
                    imageUrl={aboutHeaderBg}
                    setImageUrl={setAboutHeaderBg}
                    targetWidth={1920}
                    targetHeight={600}
                  />
                </div>
              </div>

              {/* Page Title - Bilingual */}
              <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                  {t("PageTitle")}
                </label>
                <div className="md:col-span-4">
                  <InputAreaTwo
                    register={register}
                    label="Page Title (English)"
                    name="about_page_title_en"
                    type="text"
                    placeholder={t("PageTitle")}
                  />
                  <Error errorName={errors.about_page_title_en} />
                </div>
                <div className="md:col-span-4">
                  <InputAreaTwo
                    register={register}
                    label="عنوان الصفحة (العربية)"
                    name="about_page_title_ar"
                    type="text"
                    placeholder="أدخل العنوان بالعربية"
                  />
                  <Error errorName={errors.about_page_title_ar} />
                </div>
              </div>

              {/* Hero Description - Bilingual */}
              <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                  {t("HeroDescription")}
                </label>
                <div className="md:col-span-4">
                  <TextAreaCom
                    register={register}
                    label="Hero Description (English)"
                    name="about_page_hero_description_en"
                    placeholder="Learn more about SAPT Markets and our story..."
                  />
                  <Error errorName={errors.about_page_hero_description_en} />
                </div>
                <div className="md:col-span-4">
                  <TextAreaCom
                    register={register}
                    label="وصف البطل (العربية)"
                    name="about_page_hero_description_ar"
                    placeholder="تعرف على المزيد عن أسواق سابت وقصتنا..."
                  />
                  <Error errorName={errors.about_page_hero_description_ar} />
                </div>
              </div>
            </div>

            {/* Top Content Section */}
            <div className="inline-flex md:text-base text-sm mb-3 mt-5 text-gray-500 dark:text-gray-400">
              <strong>Top Content Section</strong>
            </div>
            <hr className="md:mb-12 mb-3" />

            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                Show Top Section
              </label>
              <div className="sm:col-span-4">
                <SwitchToggle
                  title=""
                  handleProcess={setAboutTopContentLeft}
                  processOption={aboutTopContentLeft}
                  name={aboutTopContentLeft}
                />
              </div>
            </div>

            <div
              className="mb-height-0"
              style={{
                height: aboutTopContentLeft ? "auto" : 0,
                transition: "all 0.5s",
                visibility: !aboutTopContentLeft ? "hidden" : "visible",
                opacity: !aboutTopContentLeft ? "0" : "1",
              }}
            >
              {/* Top Section Title - Bilingual */}
              <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                  Top Section Title
                </label>
                <div className="md:col-span-4">
                  <InputAreaTwo
                    register={register}
                    label="Top Section Title (English)"
                    name="about_page_top_section_title_en"
                    type="text"
                    placeholder="A Trusted Name in Qassim Retail"
                  />
                  <Error errorName={errors.about_page_top_section_title_en} />
                </div>
                <div className="md:col-span-4">
                  <InputAreaTwo
                    register={register}
                    label="عنوان القسم العلوي (العربية)"
                    name="about_page_top_section_title_ar"
                    type="text"
                    placeholder="اسم موثوق في تجارة القصيم"
                  />
                  <Error errorName={errors.about_page_top_section_title_ar} />
                </div>
              </div>

              {/* Top Section Description - Bilingual */}
              <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                  Top Section Description
                </label>
                <div className="md:col-span-4">
                  <TextAreaCom
                    register={register}
                    label="Top Section Description (English)"
                    name="about_page_top_section_description_en"
                    placeholder="At SAPT Markets, we've built our reputation on providing quality products..."
                  />
                  <Error errorName={errors.about_page_top_section_description_en} />
                </div>
                <div className="md:col-span-4">
                  <TextAreaCom
                    register={register}
                    label="وصف القسم العلوي (العربية)"
                    name="about_page_top_section_description_ar"
                    placeholder="في أسواق سابت، بنينا سمعتنا على تقديم منتجات عالية الجودة..."
                  />
                  <Error errorName={errors.about_page_top_section_description_ar} />
                </div>
              </div>

              {/* Trusted Badges - Bilingual */}
              <div className="mb-6 mt-8">
                {/* Badge 1 */}
                <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                    Trusted Badge 1 Pill
                  </label>
                  <div className="md:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Badge 1 Pill (English)"
                      name="about_page_trusted_badge_one_pill_en"
                      type="text"
                      placeholder="Since 1989"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="شارة الثقة 1 (العربية)"
                      name="about_page_trusted_badge_one_pill_ar"
                      type="text"
                      placeholder="منذ 1989"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                    Trusted Badge 1 Text
                  </label>
                  <div className="md:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Badge 1 Text (English)"
                      name="about_page_trusted_badge_one_text_en"
                      type="text"
                      placeholder="From Family Business"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="نص الشارة 1 (العربية)"
                      name="about_page_trusted_badge_one_text_ar"
                      type="text"
                      placeholder="من عمل عائلي"
                    />
                  </div>
                </div>

                {/* Badge 2 */}
                <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                    Trusted Badge 2 Pill
                  </label>
                  <div className="md:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Badge 2 Pill (English)"
                      name="about_page_trusted_badge_two_pill_en"
                      type="text"
                      placeholder="35+ Years"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="شارة الثقة 2 (العربية)"
                      name="about_page_trusted_badge_two_pill_ar"
                      type="text"
                      placeholder="35+ سنة"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                  <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                    Trusted Badge 2 Text
                  </label>
                  <div className="md:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="Badge 2 Text (English)"
                      name="about_page_trusted_badge_two_text_en"
                      type="text"
                      placeholder="Serving the Community"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <InputAreaTwo
                      register={register}
                      label="نص الشارة 2 (العربية)"
                      name="about_page_trusted_badge_two_text_ar"
                      type="text"
                      placeholder="خدمة المجتمع"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                  Top Section Image
                </label>
                <div className="sm:col-span-4">
                  <UploaderWithCropper
                    imageUrl={aboutTopContentRightImage}
                    setImageUrl={setAboutTopContentRightImage}
                    targetWidth={1050}
                    targetHeight={805}
                  />
                </div>
              </div>

              {/* Card One - Bilingual */}
              <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                  Card One Title
                </label>
                <div className="md:col-span-4">
                  <InputAreaTwo
                    register={register}
                    label="Card One Title (English)"
                    name="about_page_card_one_title_en"
                    type="text"
                    placeholder="Everyday Essentials"
                  />
                  <Error errorName={errors.about_page_card_one_title_en} />
                </div>
                <div className="md:col-span-4">
                  <InputAreaTwo
                    register={register}
                    label="عنوان البطاقة الأولى (العربية)"
                    name="about_page_card_one_title_ar"
                    type="text"
                    placeholder="الضروريات اليومية"
                  />
                  <Error errorName={errors.about_page_card_one_title_ar} />
                </div>
              </div>

              <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                  Card One Subtitle
                </label>
                <div className="md:col-span-4">
                  <InputAreaTwo
                    register={register}
                    label="Card One Subtitle (English)"
                    name="about_page_card_one_subtitle_en"
                    type="text"
                    placeholder="From Pantry to Home"
                  />
                  <Error errorName={errors.about_page_card_one_subtitle_en} />
                </div>
                <div className="md:col-span-4">
                  <InputAreaTwo
                    register={register}
                    label="نص فرعي للبطاقة الأولى (العربية)"
                    name="about_page_card_one_subtitle_ar"
                    type="text"
                    placeholder="من المخزن إلى المنزل"
                  />
                  <Error errorName={errors.about_page_card_one_subtitle_ar} />
                </div>
              </div>

              <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                  Card One Description
                </label>
                <div className="md:col-span-4">
                  <TextAreaCom
                    register={register}
                    label="Card One Description (English)"
                    name="about_page_card_one_description_en"
                    type="text"
                    placeholder="We offer a comprehensive range of household necessities..."
                  />
                  <Error errorName={errors.about_page_card_one_description_en} />
                </div>
                <div className="md:col-span-4">
                  <TextAreaCom
                    register={register}
                    label="وصف البطاقة الأولى (العربية)"
                    name="about_page_card_one_description_ar"
                    type="text"
                    placeholder="نقدم مجموعة شاملة من ضروريات المنزل..."
                  />
                  <Error errorName={errors.about_page_card_one_description_ar} />
                </div>
              </div>

              {/* Card Two - Bilingual */}
              <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                  Card Two Title
                </label>
                <div className="md:col-span-4">
                  <InputAreaTwo
                    register={register}
                    label="Card Two Title (English)"
                    name="about_page_card_two_title_en"
                    type="text"
                    placeholder="Weekly Offers"
                  />
                  <Error errorName={errors.about_page_card_two_title_en} />
                </div>
                <div className="md:col-span-4">
                  <InputAreaTwo
                    register={register}
                    label="عنوان البطاقة الثانية (العربية)"
                    name="about_page_card_two_title_ar"
                    type="text"
                    placeholder="العروض الأسبوعية"
                  />
                  <Error errorName={errors.about_page_card_two_title_ar} />
                </div>
              </div>

              <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                  Card Two Subtitle
                </label>
                <div className="md:col-span-4">
                  <InputAreaTwo
                    register={register}
                    label="Card Two Subtitle (English)"
                    name="about_page_card_two_subtitle_en"
                    type="text"
                    placeholder="Save More, Shop Smart"
                  />
                  <Error errorName={errors.about_page_card_two_subtitle_en} />
                </div>
                <div className="md:col-span-4">
                  <InputAreaTwo
                    register={register}
                    label="نص فرعي للبطاقة الثانية (العربية)"
                    name="about_page_card_two_subtitle_ar"
                    type="text"
                    placeholder="وفر أكثر، تسوق بذكاء"
                  />
                  <Error errorName={errors.about_page_card_two_subtitle_ar} />
                </div>
              </div>

              <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                  Card Two Description
                </label>
                <div className="md:col-span-4">
                  <TextAreaCom
                    register={register}
                    label="Card Two Description (English)"
                    name="about_page_card_two_description_en"
                    type="text"
                    placeholder="Our regular promotional offers help families save money..."
                  />
                  <Error errorName={errors.about_page_card_two_description_en} />
                </div>
                <div className="md:col-span-4">
                  <TextAreaCom
                    register={register}
                    label="وصف البطاقة الثانية (العربية)"
                    name="about_page_card_two_description_ar"
                    type="text"
                    placeholder="عروضنا الترويجية المنتظمة تساعد العائلات على توفير المال..."
                  />
                  <Error errorName={errors.about_page_card_two_description_ar} />
                </div>
              </div>
            </div>

            <div className="inline-flex md:text-base text-sm mb-3 md:mt-5 text-gray-500 dark:text-gray-400 ">
              <strong>{t("PageTopContentRight")}</strong>
            </div>
            <hr className="md:mb-12 mb-3" />
            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                {t("EnableThisBlock")}
              </label>
              <div className="sm:col-span-4">
                <SwitchToggle
                  title=""
                  handleProcess={setAboutTopContentRight}
                  processOption={aboutTopContentRight}
                  name={aboutTopContentRight}
                />
              </div>
            </div>

            <div
              style={{
                height: aboutTopContentRight ? "auto" : 0,
                transition: "all 0.5s",
                visibility: !aboutTopContentRight ? "hidden" : "visible",
                opacity: !aboutTopContentRight ? "0" : "1",
              }}
              className="mb-height-0 grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative"
            >
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                {t("TopContentRightImage")}
              </label>
              <div className="sm:col-span-4">
                <UploaderWithCropper
                  imageUrl={aboutTopContentRightImage}
                  setImageUrl={setAboutTopContentRightImage}
                  targetWidth={1050}
                  targetHeight={805}
                />
              </div>
            </div>

            {/* Heritage Section */}
            <div className="inline-flex md:text-base text-sm mb-3 md:mt-5 text-gray-500 dark:text-gray-400 relative ">
              <strong>Heritage Section</strong>
            </div>
            <hr className="md:mb-12 mb-3" />
            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                Show Heritage Section
              </label>
              <div className="sm:col-span-4">
                <SwitchToggle
                  title=""
                  handleProcess={setAboutMiddleContentSection}
                  processOption={aboutMiddleContentSection}
                  name={aboutMiddleContentSection}
                />
              </div>
            </div>

            <div
              className="mb-height-0"
              style={{
                height: aboutMiddleContentSection ? "auto" : 0,
                transition: "all 0.5s",
                visibility: !aboutMiddleContentSection ? "hidden" : "visible",
                opacity: !aboutMiddleContentSection ? "0" : "1",
              }}
            >
              {/* Heritage Title - Bilingual */}
              <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                  Heritage Title
                </label>
                <div className="md:col-span-4">
                  <InputAreaTwo
                    register={register}
                    label="Heritage Title (English)"
                    name="about_page_heritage_title_en"
                    type="text"
                    placeholder="Our Heritage & Vision"
                  />
                  <Error errorName={errors.about_page_heritage_title_en} />
                </div>
                <div className="md:col-span-4">
                  <InputAreaTwo
                    register={register}
                    label="عنوان التراث (العربية)"
                    name="about_page_heritage_title_ar"
                    type="text"
                    placeholder="تراثنا ورؤيتنا"
                  />
                  <Error errorName={errors.about_page_heritage_title_ar} />
                </div>
              </div>

              {/* Heritage Description One - Bilingual */}
              <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                  Heritage Description One
                </label>
                <div className="md:col-span-4">
                  <TextAreaCom
                    register={register}
                    label="Heritage Description One (English)"
                    name="about_page_heritage_description_one_en"
                    placeholder="SAPT Markets is proudly part of the Al-Muhaysini Holding family..."
                  />
                  <Error errorName={errors.about_page_heritage_description_one_en} />
                </div>
                <div className="md:col-span-4">
                  <TextAreaCom
                    register={register}
                    label="وصف التراث الأول (العربية)"
                    name="about_page_heritage_description_one_ar"
                    placeholder="أسواق سابت هي جزء فخور من عائلة آل محيسن القابضة..."
                  />
                  <Error errorName={errors.about_page_heritage_description_one_ar} />
                </div>
              </div>

              {/* Heritage Description Two - Bilingual */}
              <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                  Heritage Description Two
                </label>
                <div className="md:col-span-4">
                  <TextAreaCom
                    register={register}
                    label="Heritage Description Two (English)"
                    name="about_page_heritage_description_two_en"
                    placeholder="Today, SAPT operates multiple locations throughout Buraidah..."
                  />
                  <Error errorName={errors.about_page_heritage_description_two_en} />
                </div>
                <div className="md:col-span-4">
                  <TextAreaCom
                    register={register}
                    label="وصف التراث الثاني (العربية)"
                    name="about_page_heritage_description_two_ar"
                    placeholder="اليوم، تعمل أسواق سابت في مواقع متعددة في جميع أنحاء بريدة..."
                  />
                  <Error errorName={errors.about_page_heritage_description_two_ar} />
                </div>
              </div>

              <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                  Heritage Image
                </label>
                <div className="sm:col-span-4">
                  <UploaderWithCropper
                    imageUrl={aboutMiddleContentImage}
                    setImageUrl={setAboutMiddleContentImage}
                    targetWidth={1420}
                    targetHeight={425}
                  />
                </div>
              </div>
            </div>

            {/* Team Section */}
            <div className="inline-flex md:text-base text-sm mb-3 md:mt-5 text-gray-500 dark:text-gray-400 ">
              <strong>Team Section</strong>
            </div>
            <hr className="md:mb-12 mb-3" />
            <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
              <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                Show Team Section
              </label>
              <div className="sm:col-span-4">
                <SwitchToggle
                  title=""
                  handleProcess={setOurFounderSection}
                  processOption={ourFounderSection}
                  name={ourFounderSection}
                />
              </div>
            </div>

            <div
              className="mb-height-0"
              style={{
                height: ourFounderSection ? "auto" : 0,
                transition: "all 0.5s",
                visibility: !ourFounderSection ? "hidden" : "visible",
                opacity: !ourFounderSection ? "0" : "1",
              }}
            >
              {/* Team Title - Bilingual */}
              <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                  Team Title
                </label>
                <div className="md:col-span-4">
                  <InputAreaTwo
                    register={register}
                    label="Team Title (English)"
                    name="about_page_team_title_en"
                    type="text"
                    placeholder="Meet the SAPT Family"
                  />
                  <Error errorName={errors.about_page_team_title_en} />
                </div>
                <div className="md:col-span-4">
                  <InputAreaTwo
                    register={register}
                    label="عنوان الفريق (العربية)"
                    name="about_page_team_title_ar"
                    type="text"
                    placeholder="تعرف على عائلة سابت"
                  />
                  <Error errorName={errors.about_page_team_title_ar} />
                </div>
              </div>

              {/* Team Description - Bilingual */}
              <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                  Team Description
                </label>
                <div className="md:col-span-4">
                  <TextAreaCom
                    register={register}
                    label="Team Description (English)"
                    name="about_page_team_description_en"
                    placeholder="Our dedicated team members are the backbone of SAPT Markets..."
                  />
                  <Error errorName={errors.about_page_team_description_en} />
                </div>
                <div className="md:col-span-4">
                  <TextAreaCom
                    register={register}
                    label="وصف الفريق (العربية)"
                    name="about_page_team_description_ar"
                    placeholder="أعضاء فريقنا المتفانين هم العمود الفقري لأسواق سابت..."
                  />
                  <Error errorName={errors.about_page_team_description_ar} />
                </div>
              </div>

                    {/* Leadership Title - Bilingual */}
                    <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                      <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                  Leadership Title
                      </label>
                      <div className="md:col-span-4">
                  <InputAreaTwo
                register={register}
                label="Leadership Title (English)"
                    name="about_page_leadership_title_en"
                    type="text"
                    placeholder="Leadership that Inspires"
                  />
                  <Error errorName={errors.about_page_leadership_title_en} />
                      </div>
                      <div className="md:col-span-4">
                  <InputAreaTwo
                register={register}
                label="عنوان القيادة (العربية)"
                    name="about_page_leadership_title_ar"
                    type="text"
                    placeholder="قيادة تلهم"
                  />
                  <Error errorName={errors.about_page_leadership_title_ar} />
                      </div>
                    </div>

              {/* Leadership Subtitle - Bilingual */}
              <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                      <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                  Leadership Subtitle
                      </label>
                      <div className="md:col-span-4">
                        <InputAreaTwo
                register={register}
                label="Leadership Subtitle (English)"
                    name="about_page_leadership_subtitle_en"
                          type="text"
                    placeholder="Guided by Vision, Committed to Excellence"
              />
                  <Error errorName={errors.about_page_leadership_subtitle_en} />
                      </div>
                      <div className="md:col-span-4">
                        <InputAreaTwo
                register={register}
                label="نص فرعي للقيادة (العربية)"
                    name="about_page_leadership_subtitle_ar"
                          type="text"
                    placeholder="موجهون بالرؤية، ملتزمون بالتميز"
              />
                  <Error errorName={errors.about_page_leadership_subtitle_ar} />
                      </div>
                    </div>

              {/* Values Title - Bilingual */}
              <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                  Values Title
                </label>
                <div className="md:col-span-4">
                  <InputAreaTwo
                    register={register}
                    label="Values Title (English)"
                    name="about_page_values_title_en"
                    type="text"
                    placeholder="Our Core Values"
                  />
                  <Error errorName={errors.about_page_values_title_en} />
                </div>
                <div className="md:col-span-4">
                  <InputAreaTwo
                    register={register}
                    label="عنوان القيم (العربية)"
                    name="about_page_values_title_ar"
                    type="text"
                    placeholder="قيمنا الأساسية"
                  />
                  <Error errorName={errors.about_page_values_title_ar} />
                </div>
              </div>

              {/* Values Description - Bilingual */}
              <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
                <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                  Values Description
                </label>
                <div className="md:col-span-4">
                  <TextAreaCom
                    register={register}
                    label="Values Description (English)"
                    name="about_page_values_description_en"
                    placeholder="These fundamental principles guide every decision we make..."
                  />
                  <Error errorName={errors.about_page_values_description_en} />
                </div>
                <div className="md:col-span-4">
                  <TextAreaCom
                    register={register}
                    label="وصف القيم (العربية)"
                    name="about_page_values_description_ar"
                    placeholder="هذه المبادئ الأساسية توجه كل قرار نتخذه..."
                  />
                  <Error errorName={errors.about_page_values_description_ar} />
                </div>
              </div>
            </div>

            {/* Core Values Section */}
            <div className="inline-flex md:text-base text-sm mb-3 md:mt-5 text-gray-500 dark:text-gray-400 ">
              <strong>Core Values Section</strong>
            </div>
            <hr className="md:mb-12 mb-3" />

                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                Show Values Section
                      </label>
                      <div className="sm:col-span-4">
                <SwitchToggle
                  title=""
                  handleProcess={setAboutCoreValues}
                  processOption={aboutCoreValues}
                  name={aboutCoreValues}
                        />
                      </div>
                    </div>

            <div
              className="mb-height-0"
              style={{
                height: aboutCoreValues ? "auto" : 0,
                transition: "all 0.5s",
                visibility: !aboutCoreValues ? "hidden" : "visible",
                opacity: !aboutCoreValues ? "0" : "1",
              }}
            >
              {/*  ====================================================== Core Values ====================================================== */}

              <TabsComponent>
                <Tabs>
                  <TabList>
                    <Tab>Value 1</Tab>
                    <Tab>Value 2</Tab>
                    <Tab>Value 3</Tab>
                    <Tab>Value 4</Tab>
                  </TabList>

                  <TabPanel className="mt-10">
                    {/* Value One Title - Bilingual */}
                    <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Value One Title
                      </label>
                      <div className="md:col-span-4">
                        <InputAreaTwo
                       register={register}
                       label="Value One Title (English)"
                          name="about_page_value_one_title_en"
                          type="text"
                          placeholder="Quality First"
                        />
                        <Error errorName={errors.about_page_value_one_title_en} />
                      </div>
                      <div className="md:col-span-4">
                        <InputAreaTwo
                       register={register}
                       label="عنوان القيمة الأولى (العربية)"
                          name="about_page_value_one_title_ar"
                          type="text"
                          placeholder="الجودة أولاً"
                        />
                        <Error errorName={errors.about_page_value_one_title_ar} />
                      </div>
                    </div>

                    {/* Value One Description - Bilingual */}
                    <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Value One Description
                      </label>
                      <div className="md:col-span-4">
                        <TextAreaCom
                       register={register}
                       label="Value One Description (English)"
                          name="about_page_value_one_description_en"
                          placeholder="We never compromise on the quality of our products..."
                     />
                        <Error errorName={errors.about_page_value_one_description_en} />
                      </div>
                      <div className="md:col-span-4">
                        <TextAreaCom
                       register={register}
                       label="وصف القيمة الأولى (العربية)"
                          name="about_page_value_one_description_ar"
                          placeholder="نحن لا نتنازل أبدًا عن جودة منتجاتنا..."
                     />
                        <Error errorName={errors.about_page_value_one_description_ar} />
                      </div>
                    </div>
                  </TabPanel>

                  <TabPanel>
                    {/* Value Two Title - Bilingual */}
                    <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Value Two Title
                      </label>
                      <div className="md:col-span-4">
                        <InputAreaTwo
                      register={register}
                      label="Value Two Title (English)"
                          name="about_page_value_two_title_en"
                          type="text"
                          placeholder="Customer Care"
                        />
                        <Error errorName={errors.about_page_value_two_title_en} />
                      </div>
                      <div className="md:col-span-4">
                        <InputAreaTwo
                      register={register}
                      label="عنوان القيمة الثانية (العربية)"
                          name="about_page_value_two_title_ar"
                          type="text"
                          placeholder="رعاية العملاء"
                        />
                        <Error errorName={errors.about_page_value_two_title_ar} />
                      </div>
                    </div>

                    {/* Value Two Description - Bilingual */}
                    <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Value Two Description
                      </label>
                      <div className="md:col-span-4">
                        <TextAreaCom
                      register={register}
                      label="Value Two Description (English)"
                          name="about_page_value_two_description_en"
                          placeholder="Every customer is valued and deserves exceptional service..."
                    />
                        <Error errorName={errors.about_page_value_two_description_en} />
                      </div>
                      <div className="md:col-span-4">
                        <TextAreaCom
                      register={register}
                      label="وصف القيمة الثانية (العربية)"
                          name="about_page_value_two_description_ar"
                          placeholder="كل عميل محترم ويستحق خدمة استثنائية..."
                    />
                        <Error errorName={errors.about_page_value_two_description_ar} />
                      </div>
                    </div>
                  </TabPanel>

                  <TabPanel>
                    {/* Value Three Title - Bilingual */}
                    <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Value Three Title
                      </label>
                      <div className="md:col-span-4">
                        <InputAreaTwo
                       register={register}
                       label="Value Three Title (English)"
                          name="about_page_value_three_title_en"
                          type="text"
                          placeholder="Community Focus"
                        />
                        <Error errorName={errors.about_page_value_three_title_en} />
                      </div>
                      <div className="md:col-span-4">
                        <InputAreaTwo
                       register={register}
                       label="عنوان القيمة الثالثة (العربية)"
                          name="about_page_value_three_title_ar"
                          type="text"
                          placeholder="التركيز على المجتمع"
                        />
                        <Error errorName={errors.about_page_value_three_title_ar} />
                      </div>
                    </div>

                    {/* Value Three Description - Bilingual */}
                    <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Value Three Description
                      </label>
                      <div className="md:col-span-4">
                        <TextAreaCom
                       register={register}
                       label="Value Three Description (English)"
                          name="about_page_value_three_description_en"
                          placeholder="We're not just a store; we're part of the Qassim community..."
                     />
                        <Error errorName={errors.about_page_value_three_description_en} />
                      </div>
                      <div className="md:col-span-4">
                        <TextAreaCom
                       register={register}
                       label="وصف القيمة الثالثة (العربية)"
                          name="about_page_value_three_description_ar"
                          placeholder="نحن لسنا مجرد متجر؛ نحن جزء من مجتمع القصيم..."
                     />
                        <Error errorName={errors.about_page_value_three_description_ar} />
                      </div>
                    </div>
                  </TabPanel>

                  <TabPanel>
                    {/* Value Four Title - Bilingual */}
                    <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Value Four Title
                      </label>
                      <div className="md:col-span-4">
                        <InputAreaTwo
                       register={register}
                       label="Value Four Title (English)"
                          name="about_page_value_four_title_en"
                          type="text"
                          placeholder="Innovation"
                        />
                        <Error errorName={errors.about_page_value_four_title_en} />
                      </div>
                      <div className="md:col-span-4">
                        <InputAreaTwo
                       register={register}
                       label="عنوان القيمة الرابعة (العربية)"
                          name="about_page_value_four_title_ar"
                          type="text"
                          placeholder="الابتكار"
                        />
                        <Error errorName={errors.about_page_value_four_title_ar} />
                      </div>
                    </div>

                    {/* Value Four Description - Bilingual */}
                    <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Value Four Description
                      </label>
                      <div className="md:col-span-4">
                        <TextAreaCom
                       register={register}
                       label="Value Four Description (English)"
                          name="about_page_value_four_description_en"
                          placeholder="We continuously evolve to meet changing customer needs..."
                     />
                        <Error errorName={errors.about_page_value_four_description_en} />
                      </div>
                      <div className="md:col-span-4">
                        <TextAreaCom
                       register={register}
                       label="وصف القيمة الرابعة (العربية)"
                          name="about_page_value_four_description_ar"
                          placeholder="نحن نتطور باستمرار لتلبية احتياجات العملاء المتغيرة..."
                     />
                        <Error errorName={errors.about_page_value_four_description_ar} />
                      </div>
                    </div>
                  </TabPanel>
                </Tabs>
              </TabsComponent>
            </div>

            {/* Team Members Management */}
            <div className="inline-flex md:text-base text-sm mb-3 md:mt-5 text-gray-500 dark:text-gray-400 ">
              <strong>Team Members</strong>
            </div>
            <hr className="md:mb-12 mb-3" />

                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                Show Team Members
                      </label>
                      <div className="sm:col-span-4">
                <SwitchToggle
                  title=""
                  handleProcess={setOurFounderSection}
                  processOption={ourFounderSection}
                  name={ourFounderSection}
                />
              </div>
            </div>

            <div
              className="mb-height-0"
              style={{
                height: ourFounderSection ? "auto" : 0,
                transition: "all 0.5s",
                visibility: !ourFounderSection ? "hidden" : "visible",
                opacity: !ourFounderSection ? "0" : "1",
              }}
            >
              {/*  ====================================================== Team Members ====================================================== */}

              <TabsComponent>
                <Tabs>
                  <TabList>
                    <Tab>Member 1</Tab>
                    <Tab>Member 2</Tab>
                    <Tab>Member 3</Tab>
                    <Tab>Member 4</Tab>
                    <Tab>Member 5</Tab>
                    <Tab>Member 6</Tab>
                    <Tab>Member 7</Tab>
                    <Tab>Member 8</Tab>
                    <Tab>Member 9</Tab>
                    <Tab>Member 10</Tab>
                    <Tab>Member 11</Tab>
                    <Tab>Member 12</Tab>
                  </TabList>

                  <TabPanel className="mt-10">
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 1 Image
                      </label>
                      <div className="sm:col-span-4">
                        <UploaderWithCropper
                          imageUrl={ourFounderOneImage}
                          setImageUrl={setOurFounderOneImage}
                          targetWidth={600}
                          targetHeight={600}
                        />
                      </div>
                    </div>
                    {/* Member 1 Name - Bilingual */}
                    <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 1 Name
                      </label>
                      <div className="md:col-span-4">
                        <InputAreaTwo
                      register={register}
                      label="Member 1 Name (English)"
                          name="about_page_founder_one_name_en"
                          type="text"
                          placeholder="Team Member 1 Name"
                        />
                        <Error errorName={errors.about_page_founder_one_name_en} />
                      </div>
                      <div className="md:col-span-4">
                        <InputAreaTwo
                      register={register}
                      label="اسم العضو الأول (العربية)"
                          name="about_page_founder_one_name_ar"
                          type="text"
                          placeholder="اسم عضو الفريق الأول"
                        />
                        <Error errorName={errors.about_page_founder_one_name_ar} />
                      </div>
                    </div>
                    {/* Member 1 Position - Bilingual */}
                    <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 1 Position
                      </label>
                      <div className="md:col-span-4">
                        <InputAreaTwo
                      register={register}
                      label="Member 1 Position (English)"
                          name="about_page_founder_one_position_en"
                          type="text"
                          placeholder="Team Member 1 Position"
                    />
                        <Error errorName={errors.about_page_founder_one_position_en} />
                      </div>
                      <div className="md:col-span-4">
                        <InputAreaTwo
                      register={register}
                      label="منصب العضو الأول (العربية)"
                          name="about_page_founder_one_position_ar"
                          type="text"
                          placeholder="منصب عضو الفريق الأول"
                    />
                        <Error errorName={errors.about_page_founder_one_position_ar} />
                      </div>
                    </div>
                  </TabPanel>

                  <TabPanel className="mt-10">
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 2 Image
                      </label>
                      <div className="sm:col-span-4">
                        <UploaderWithCropper
                          imageUrl={ourFounderTwoImage}
                          setImageUrl={setOurFounderTwoImage}
                          targetWidth={600}
                          targetHeight={600}
                        />
                      </div>
                    </div>
                    {/* Member 2 Name - Bilingual */}
                    <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 2 Name
                      </label>
                      <div className="md:col-span-4">
                        <InputAreaTwo
                      register={register}
                      label="Member 2 Name (English)"
                          name="about_page_founder_two_name_en"
                          type="text"
                          placeholder="Team Member 2 Name"
                        />
                        <Error errorName={errors.about_page_founder_two_name_en} />
                      </div>
                      <div className="md:col-span-4">
                        <InputAreaTwo
                      register={register}
                      label="اسم العضو الثاني (العربية)"
                          name="about_page_founder_two_name_ar"
                          type="text"
                          placeholder="اسم عضو الفريق الثاني"
                        />
                        <Error errorName={errors.about_page_founder_two_name_ar} />
                      </div>
                    </div>
                    {/* Member 2 Position - Bilingual */}
                    <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 2 Position
                      </label>
                      <div className="md:col-span-4">
                        <InputAreaTwo
                      register={register}
                      label="Member 2 Position (English)"
                          name="about_page_founder_two_position_en"
                          type="text"
                          placeholder="Team Member 2 Position"
                    />
                        <Error errorName={errors.about_page_founder_two_position_en} />
                      </div>
                      <div className="md:col-span-4">
                        <InputAreaTwo
                      register={register}
                      label="منصب العضو الثاني (العربية)"
                          name="about_page_founder_two_position_ar"
                          type="text"
                          placeholder="منصب عضو الفريق الثاني"
                    />
                        <Error errorName={errors.about_page_founder_two_position_ar} />
                      </div>
                    </div>
                  </TabPanel>

                  <TabPanel className="mt-10">
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 3 Image
            </label>
            <div className="sm:col-span-4">
                        <UploaderWithCropper
                          imageUrl={ourFounderThreeImage}
                          setImageUrl={setOurFounderThreeImage}
                          targetWidth={600}
                          targetHeight={600}
                        />
            </div>
          </div>
          {/* Member 3 Name - Bilingual */}
          <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 3 Name
            </label>
            <div className="md:col-span-4">
                  <InputAreaTwo
            register={register}
            label="Member 3 Name (English)"
                          name="about_page_founder_three_name_en"
                type="text"
                          placeholder="Team Member 3 Name"
          />
                        <Error errorName={errors.about_page_founder_three_name_en} />
          </div>
          <div className="md:col-span-4">
                  <InputAreaTwo
            register={register}
            label="اسم العضو الثالث (العربية)"
                          name="about_page_founder_three_name_ar"
                type="text"
                          placeholder="اسم عضو الفريق الثالث"
          />
                        <Error errorName={errors.about_page_founder_three_name_ar} />
          </div>
          </div>
                    {/* Member 3 Position - Bilingual */}
                    <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 3 Position
                  </label>
                      <div className="md:col-span-4">
                  <InputAreaTwo
            register={register}
            label="Member 3 Position (English)"
                          name="about_page_founder_three_position_en"
                    type="text"
                          placeholder="Team Member 3 Position"
          />
                        <Error errorName={errors.about_page_founder_three_position_en} />
                </div>
                <div className="md:col-span-4">
                  <InputAreaTwo
            register={register}
            label="منصب العضو الثالث (العربية)"
                          name="about_page_founder_three_position_ar"
                    type="text"
                          placeholder="منصب عضو الفريق الثالث"
          />
                        <Error errorName={errors.about_page_founder_three_position_ar} />
                </div>
                </div>
                  </TabPanel>

                  <TabPanel className="mt-10">
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 4 Image
                  </label>
                      <div className="sm:col-span-4">
                        <UploaderWithCropper
                          imageUrl={ourFounderFourImage}
                          setImageUrl={setOurFounderFourImage}
                          targetWidth={600}
                          targetHeight={600}
                        />
                </div>
              </div>
                    {/* Member 4 Name - Bilingual */}
                    <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 4 Name
                  </label>
                      <div className="md:col-span-4">
                  <InputAreaTwo
                      register={register}
                      label="Member 4 Name (English)"
                          name="about_page_founder_four_name_en"
                    type="text"
                          placeholder="Team Member 4 Name"
                    />
                        <Error errorName={errors.about_page_founder_four_name_en} />
                </div>
                <div className="md:col-span-4">
                  <InputAreaTwo
                      register={register}
                      label="اسم العضو الرابع (العربية)"
                          name="about_page_founder_four_name_ar"
                    type="text"
                          placeholder="اسم عضو الفريق الرابع"
                    />
                        <Error errorName={errors.about_page_founder_four_name_ar} />
                </div>
                </div>
          {/* Member 4 Position - Bilingual */}
          <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 4 Position
                  </label>
            <div className="md:col-span-4">
                  <InputAreaTwo
              register={register}
              label="Member 4 Position (English)"
                          name="about_page_founder_four_position_en"
                    type="text"
                          placeholder="Team Member 4 Position"
            />
                        <Error errorName={errors.about_page_founder_four_position_en} />
                </div>
                <div className="md:col-span-4">
                  <InputAreaTwo
              register={register}
              label="منصب العضو الرابع (العربية)"
                          name="about_page_founder_four_position_ar"
                    type="text"
                          placeholder="منصب عضو الفريق الرابع"
            />
                        <Error errorName={errors.about_page_founder_four_position_ar} />
                </div>
          </div>
                  </TabPanel>

                  <TabPanel className="mt-10">
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 5 Image
                  </label>
            <div className="sm:col-span-4">
                        <UploaderWithCropper
                          imageUrl={ourFounderFiveImage}
                          setImageUrl={setOurFounderFiveImage}
                          targetWidth={600}
                          targetHeight={600}
                        />
                </div>
              </div>
          {/* Member 5 Name - Bilingual */}
          <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 5 Name
                  </label>
            <div className="md:col-span-4">
                  <InputAreaTwo
            register={register}
            label="Member 5 Name (English)"
                          name="about_page_founder_five_name_en"
                    type="text"
                          placeholder="Team Member 5 Name"
          />
                        <Error errorName={errors.about_page_founder_five_name_en} />
                </div>
                <div className="md:col-span-4">
                  <InputAreaTwo
            register={register}
            label="اسم العضو الخامس (العربية)"
                          name="about_page_founder_five_name_ar"
                    type="text"
                          placeholder="اسم عضو الفريق الخامس"
          />
                        <Error errorName={errors.about_page_founder_five_name_ar} />
                </div>
                    </div>
                    {/* Member 5 Position - Bilingual */}
                    <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 5 Position
                  </label>
                      <div className="md:col-span-4">
                  <InputAreaTwo
            register={register}
            label="Member 5 Position (English)"
                          name="about_page_founder_five_position_en"
                    type="text"
                          placeholder="Team Member 5 Position"
          />
                        <Error errorName={errors.about_page_founder_five_position_en} />
                </div>
                <div className="md:col-span-4">
                  <InputAreaTwo
            register={register}
            label="منصب العضو الخامس (العربية)"
                          name="about_page_founder_five_position_ar"
                    type="text"
                          placeholder="منصب عضو الفريق الخامس"
          />
                        <Error errorName={errors.about_page_founder_five_position_ar} />
                </div>
              </div>
                  </TabPanel>

                  <TabPanel className="mt-10">
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 6 Image
                  </label>
                      <div className="sm:col-span-4">
                        <UploaderWithCropper
                          imageUrl={ourFounderSixImage}
                          setImageUrl={setOurFounderSixImage}
                          targetWidth={600}
                          targetHeight={600}
                        />
          </div>
                    </div>
          {/* Member 6 Name - Bilingual */}
          <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 6 Name
            </label>
            <div className="md:col-span-4">
              <InputAreaTwo
              register={register}
              label="Member 6 Name (English)"
                          name="about_page_founder_six_name_en"
                type="text"
                          placeholder="Team Member 6 Name"
            />
                        <Error errorName={errors.about_page_founder_six_name_en} />
            </div>
            <div className="md:col-span-4">
              <InputAreaTwo
              register={register}
              label="اسم العضو السادس (العربية)"
                          name="about_page_founder_six_name_ar"
                type="text"
                          placeholder="اسم عضو الفريق السادس"
            />
                        <Error errorName={errors.about_page_founder_six_name_ar} />
            </div>
          </div>
          {/* Member 6 Position - Bilingual */}
          <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 6 Position
            </label>
            <div className="md:col-span-4">
              <InputAreaTwo
              register={register}
              label="Member 6 Position (English)"
                          name="about_page_founder_six_position_en"
                type="text"
                          placeholder="Team Member 6 Position"
            />
                        <Error errorName={errors.about_page_founder_six_position_en} />
            </div>
            <div className="md:col-span-4">
              <InputAreaTwo
              register={register}
              label="منصب العضو السادس (العربية)"
                          name="about_page_founder_six_position_ar"
                type="text"
                          placeholder="منصب عضو الفريق السادس"
            />
                        <Error errorName={errors.about_page_founder_six_position_ar} />
            </div>
          </div>
                  </TabPanel>

                  <TabPanel className="mt-10">
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 7 Image
            </label>
            <div className="sm:col-span-4">
                        <UploaderWithCropper
                          imageUrl={ourFounderSevenImage}
                          setImageUrl={setOurFounderSevenImage}
                          targetWidth={600}
                          targetHeight={600}
                        />
            </div>
          </div>
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 7 Name
                  </label>
            <div className="sm:col-span-4">
                  <InputAreaTwo
              register={register}
              label="Member 7 Name"
                          name="about_page_founder_seven_name_en"
                    type="text"
                          placeholder="Team Member 7 Name"
            />
                        <Error errorName={errors.about_page_founder_seven_name} />
                </div>
          </div>
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 7 Position
                  </label>
            <div className="sm:col-span-4">
                  <InputAreaTwo
              register={register}
              label="Member 7 Position"
                          name="about_page_founder_seven_position_en"
                    type="text"
                          placeholder="Team Member 7 Position"
            />
                        <Error errorName={errors.about_page_founder_seven_position} />
                </div>
              </div>
                  </TabPanel>

                  <TabPanel className="mt-10">
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 8 Image
                  </label>
                      <div className="sm:col-span-4">
                        <UploaderWithCropper
                          imageUrl={ourFounderEightImage}
                          setImageUrl={setOurFounderEightImage}
                          targetWidth={600}
                          targetHeight={600}
                        />
                </div>
                </div>
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 8 Name
                  </label>
                      <div className="sm:col-span-4">
                  <InputAreaTwo
              register={register}
              label="Member 8 Name"
                          name="about_page_founder_eight_name_en"
                    type="text"
                          placeholder="Team Member 8 Name"
            />
                        <Error errorName={errors.about_page_founder_eight_name} />
                </div>
              </div>
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 8 Position
            </label>
            <div className="sm:col-span-4">
              <InputAreaTwo
              register={register}
              label="Member 8 Position"
                          name="about_page_founder_eight_position_en"
                type="text"
                          placeholder="Team Member 8 Position"
            />
                        <Error errorName={errors.about_page_founder_eight_position} />
            </div>
          </div>
                  </TabPanel>

                  <TabPanel className="mt-10">
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 9 Image
            </label>
            <div className="sm:col-span-4">
                        <UploaderWithCropper
                          imageUrl={ourFounderNineImage}
                          setImageUrl={setOurFounderNineImage}
                          targetWidth={600}
                          targetHeight={600}
                        />
            </div>
          </div>
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 9 Name
            </label>
            <div className="sm:col-span-4">
              <InputAreaTwo
              register={register}
              label="Member 9 Name"
                          name="about_page_founder_nine_name_en"
                type="text"
                          placeholder="Team Member 9 Name"
            />
                        <Error errorName={errors.about_page_founder_nine_name} />
            </div>
          </div>
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 9 Position
            </label>
            <div className="sm:col-span-4">
                  <InputAreaTwo
              register={register}
              label="Member 9 Position"
                          name="about_page_founder_nine_position_en"
                    type="text"
                          placeholder="Team Member 9 Position"
            />
                        <Error errorName={errors.about_page_founder_nine_position} />
            </div>
          </div>
                  </TabPanel>

                  <TabPanel className="mt-10">
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 10 Image
                  </label>
                      <div className="sm:col-span-4">
                        <UploaderWithCropper
                          imageUrl={ourFounderTenImage}
                          setImageUrl={setOurFounderTenImage}
                          targetWidth={600}
                          targetHeight={600}
                        />
                </div>
                </div>
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 10 Name
                  </label>
                      <div className="sm:col-span-4">
                  <InputAreaTwo
              register={register}
              label="Member 10 Name"
                          name="about_page_founder_ten_name_en"
                    type="text"
                          placeholder="Team Member 10 Name"
            />
                        <Error errorName={errors.about_page_founder_ten_name} />
                </div>
                    </div>
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 10 Position
                  </label>
                      <div className="sm:col-span-4">
                  <InputAreaTwo
              register={register}
              label="Member 10 Position"
                          name="about_page_founder_ten_position_en"
                    type="text"
                          placeholder="Team Member 10 Position"
            />
                        <Error errorName={errors.about_page_founder_ten_position} />
                </div>
              </div>
                  </TabPanel>

                  <TabPanel className="mt-10">
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 11 Image
                  </label>
                      <div className="sm:col-span-4">
                        <UploaderWithCropper
                          imageUrl={ourFounderElevenImage}
                          setImageUrl={setOurFounderElevenImage}
                          targetWidth={600}
                          targetHeight={600}
                        />
                </div>
                </div>
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 11 Name
                  </label>
                      <div className="sm:col-span-4">
                  <InputAreaTwo
              register={register}
              label="Member 11 Name"
                          name="about_page_founder_eleven_name_en"
                    type="text"
                          placeholder="Team Member 11 Name"
            />
                        <Error errorName={errors.about_page_founder_eleven_name} />
                </div>
                </div>
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 11 Position
                  </label>
            <div className="sm:col-span-4">
                  <InputAreaTwo
              register={register}
              label="Member 11 Position"
                          name="about_page_founder_eleven_position_en"
                    type="text"
                          placeholder="Team Member 11 Position"
            />
                        <Error errorName={errors.about_page_founder_eleven_position} />
                </div>
              </div>
                  </TabPanel>

                  <TabPanel className="mt-10">
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 12 Image
                  </label>
            <div className="sm:col-span-4">
                        <UploaderWithCropper
                          imageUrl={ourFounderTwelveImage}
                          setImageUrl={setOurFounderTwelveImage}
                          targetWidth={600}
                          targetHeight={600}
                        />
                </div>
                </div>
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 12 Name
                  </label>
            <div className="sm:col-span-4">
                  <InputAreaTwo
              register={register}
              label="Member 12 Name"
                          name="about_page_founder_twelve_name_en"
                    type="text"
                          placeholder="Team Member 12 Name"
            />
                        <Error errorName={errors.about_page_founder_twelve_name} />
                </div>
          </div>
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 12 Position
                  </label>
            <div className="sm:col-span-4">
                  <InputAreaTwo
              register={register}
              label="Member 12 Position"
                          name="about_page_founder_twelve_position_en"
                    type="text"
                          placeholder="Team Member 12 Position"
            />
                        <Error errorName={errors.about_page_founder_twelve_position} />
                </div>
              </div>
                  </TabPanel>
                </Tabs>
              </TabsComponent>
            </div>

            {/* Branches Section */}
            <div className="inline-flex md:text-base text-sm mb-3 md:mt-5 text-gray-500 dark:text-gray-400 ">
              <strong>Branches Section</strong>
                </div>
            <hr className="md:mb-12 mb-3" />
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                Show Branches Section
                  </label>
            <div className="sm:col-span-4">
                <SwitchToggle
                  title=""
                  handleProcess={setAboutBranches}
                  processOption={aboutBranches}
                  name={aboutBranches}
                />
                </div>
          </div>

            <div
              className="mb-height-0"
              style={{
                height: aboutBranches ? "auto" : 0,
                transition: "all 0.5s",
                visibility: !aboutBranches ? "hidden" : "visible",
                opacity: !aboutBranches ? "0" : "1",
              }}
            >
              {/* Branches Title - Bilingual */}
          <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
            <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                  Branches Title
            </label>
            <div className="md:col-span-4">
              <InputAreaTwo
                register={register}
                label="Branches Title (English)"
                name="about_page_branches_title_en"
                type="text"
                placeholder="Our Locations"
              />
              <Error errorName={errors.about_page_branches_title_en} />
            </div>
            <div className="md:col-span-4">
              <InputAreaTwo
                register={register}
                label="Branches Title (Arabic)"
                name="about_page_branches_title_ar"
                type="text"
                placeholder="مواقعنا"
              />
              <Error errorName={errors.about_page_branches_title_ar} />
            </div>
          </div>

                            {/* Branches Description - Bilingual */}
              <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
            <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                  Branches Description
                  </label>
            <div className="md:col-span-4">
                  <TextAreaCom
                    register={register}
                    label="Branches Description (English)"
                    name="about_page_branches_description_en"
                    placeholder="Visit any of our convenient locations throughout Buraidah..."
                  />
                  <Error errorName={errors.about_page_branches_description_en} />
            </div>
            <div className="md:col-span-4">
                  <TextAreaCom
                    register={register}
                    label="Branches Description (Arabic)"
                    name="about_page_branches_description_ar"
                    placeholder="زر أي من فروعنا الموزعة في أنحاء بريدة..."
                  />
                  <Error errorName={errors.about_page_branches_description_ar} />
            </div>
          </div>

              {/* Branches CTA Title - Bilingual */}
              <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
            <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
              Branches CTA Title
            </label>
            <div className="md:col-span-4">
              <InputAreaTwo
                register={register}
                label="Branches CTA Title (English)"
                name="about_page_branches_cta_title_en"
                type="text"
                placeholder="Can't Find Us?"
              />
              <Error errorName={errors.about_page_branches_cta_title_en} />
            </div>
            <div className="md:col-span-4">
              <InputAreaTwo
                register={register}
                label="Branches CTA Title (Arabic)"
                name="about_page_branches_cta_title_ar"
                type="text"
                placeholder="لا تجدنا؟"
              />
              <Error errorName={errors.about_page_branches_cta_title_ar} />
            </div>
          </div>

              {/* Branches CTA Description - Bilingual */}
              <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
            <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
              Branches CTA Description
            </label>
            <div className="md:col-span-4">
              <TextAreaCom
                register={register}
                label="Branches CTA Description (English)"
                name="about_page_branches_cta_description_en"
                    placeholder="We're expanding! New locations opening soon."
              />
              <Error errorName={errors.about_page_branches_cta_description_en} />
            </div>
            <div className="md:col-span-4">
              <TextAreaCom
                register={register}
                label="Branches CTA Description (Arabic)"
                name="about_page_branches_cta_description_ar"
                    placeholder="نحن نتوسع! مواقع جديدة قريباً"
              />
              <Error errorName={errors.about_page_branches_cta_description_ar} />
            </div>
          </div>

              {/* Upcoming Branches Title - Bilingual */}
              <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3 relative">
            <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                  Upcoming Branches Title
            </label>
            <div className="md:col-span-4">
                  <InputAreaTwo
                register={register}
                    label="Upcoming Branches Title (English)"
                    name="about_page_upcoming_branches_title_en"
                    type="text"
                    placeholder="Coming Soon to New Areas"
                  />
                  <Error errorName={errors.about_page_upcoming_branches_title_en} />
            </div>
            <div className="md:col-span-4">
                  <InputAreaTwo
                register={register}
                    label="Upcoming Branches Title (Arabic)"
                    name="about_page_upcoming_branches_title_ar"
                    type="text"
                    placeholder="ريبًا في مواقع جديدة"
                  />
                  <Error errorName={errors.about_page_upcoming_branches_title_ar} />
            </div>
          </div>

              {/* Upcoming Branches (Static Two) */}
              <div className="inline-flex md:text-base text-sm mb-3 mt-8 text-gray-500 dark:text-gray-400">
                <strong>Upcoming Branches</strong>
              </div>

              {[1, 2].map((num) => (
                <div key={num} className="border p-4 rounded-lg mb-6">
                  {/* Branch {num} Name - Bilingual */}
                  <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-3">
            <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                      Branch {num} Name
            </label>
            <div className="md:col-span-4">
              <InputAreaTwo
                register={register}
                        label={`Upcoming Branch ${num} Name (English)`}
                        name={`about_page_upcoming_branch_${num === 1 ? 'one' : 'two'}_name_en`}
                type="text"
                        placeholder={`SAPT Upcoming Branch ${num}`}
              />
            </div>
            <div className="md:col-span-4">
              <InputAreaTwo
                register={register}
                        label={`Upcoming Branch ${num} Name (Arabic)`}
                        name={`about_page_upcoming_branch_${num === 1 ? 'one' : 'two'}_name_ar`}
                type="text"
                        placeholder={`فرع سبت القادم ${num}`}
              />
            </div>
          </div>

                  {/* Branch {num} Address - Bilingual */}
                  <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6">
            <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                      Address / Details
            </label>
            <div className="md:col-span-4">
              <TextAreaCom
                register={register}
                        label={`Upcoming Branch ${num} Address (English)`}
                        name={`about_page_upcoming_branch_${num === 1 ? 'one' : 'two'}_address_en`}
                        placeholder="District, City"
                      />
            </div>
            <div className="md:col-span-4">
              <TextAreaCom
                register={register}
                        label={`Upcoming Branch ${num} Address (Arabic)`}
                        name={`about_page_upcoming_branch_${num === 1 ? 'one' : 'two'}_address_ar`}
                        placeholder="الحي، المدينة"
                      />
            </div>
          </div>

                  {/* Quarter - Bilingual */}
                  <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mt-3">
            <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                      Opening Quarter (e.g., Q2 2025)
            </label>
            <div className="md:col-span-4">
              <InputAreaTwo
                register={register}
                        label={`Upcoming Branch ${num} Quarter (English)`}
                        name={`about_page_upcoming_branch_${num === 1 ? 'one' : 'two'}_quarter_en`}
                type="text"
                        placeholder="Q2 2025"
              />
            </div>
            <div className="md:col-span-4">
              <InputAreaTwo
                register={register}
                        label={`Upcoming Branch ${num} Quarter (Arabic)`}
                        name={`about_page_upcoming_branch_${num === 1 ? 'one' : 'two'}_quarter_ar`}
                type="text"
                        placeholder="الربع الثاني 2025"
              />
            </div>
          </div>

                  {/* Planned Features - Bilingual */}
                  <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mt-3">
            <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                      Planned Features (comma-separated)
            </label>
            <div className="md:col-span-4">
              <TextAreaCom
                register={register}
                        label={`Upcoming Branch ${num} Features (English)`}
                        name={`about_page_upcoming_branch_${num === 1 ? 'one' : 'two'}_features_en`}
                        placeholder="Largest Store, Food Court, Pharmacy"
                      />
            </div>
            <div className="md:col-span-4">
              <TextAreaCom
                register={register}
                        label={`Upcoming Branch ${num} Features (Arabic)`}
                        name={`about_page_upcoming_branch_${num === 1 ? 'one' : 'two'}_features_ar`}
                        placeholder="أكبر متجر، مطعم، صيدلية"
                      />
            </div>
          </div>

                  {/* Emoji / Icon - Bilingual */}
                  <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mt-3">
            <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                      Emoji Icon (single emoji)
            </label>
            <div className="md:col-span-4">
                      <InputAreaTwo
                register={register}
                        label={`Upcoming Branch ${num} Emoji (English)`}
                        name={`about_page_upcoming_branch_${num === 1 ? 'one' : 'two'}_emoji_en`}
                        type="text"
                        placeholder="🏬"
                      />
            </div>
            <div className="md:col-span-4">
                      <InputAreaTwo
                register={register}
                        label={`Upcoming Branch ${num} Emoji (Arabic)`}
                        name={`about_page_upcoming_branch_${num === 1 ? 'one' : 'two'}_emoji_ar`}
                        type="text"
                        placeholder="🏬"
                      />
            </div>
          </div>
                </div>
              ))}

              {/* Branch Management */}
              <div className="inline-flex md:text-base text-sm mb-3 md:mt-5 text-gray-500 dark:text-gray-400 ">
                <strong>Branch Management</strong>
              </div>
              <hr className="md:mb-12 mb-3" />

              <TabsComponent>
                <Tabs>
                  <TabList>
                    <Tab>Branch 1</Tab>
                    <Tab>Branch 2</Tab>
                    <Tab>Branch 3</Tab>
                    <Tab>Branch 4</Tab>
                    <Tab>Branch 5</Tab>
                    <Tab>Branch 6</Tab>
                    <Tab>Branch 7</Tab>
                    <Tab>Branch 8</Tab>
                  </TabList>

                  {[...Array(8)].map((_, idx) => {
                    const branchNum = idx + 1;
                    const branchWords = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
                    const branchWord = branchWords[idx];
                    
                    return (
                      <TabPanel key={branchNum} className="mt-10">
          {/* Branch {branchNum} Name - Bilingual */}
          <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                            Branch {branchNum} Name
            </label>
            <div className="md:col-span-4">
              <InputAreaTwo
            register={register}
            label={`Branch ${branchNum} Name (English)`}
                              name={`about_page_branch_${branchWord}_name_en`}
                type="text"
                              placeholder={`SAPT Branch ${branchNum}`}
              />
                            <Error errorName={errors[`about_page_branch_${branchWord}_name_en`]} />
            </div>
            <div className="md:col-span-4">
              <InputAreaTwo
            register={register}
            label={`Branch ${branchNum} Name (Arabic)`}
                              name={`about_page_branch_${branchWord}_name_ar`}
                type="text"
                              placeholder={`فرع سبت ${branchNum}`}
              />
                            <Error errorName={errors[`about_page_branch_${branchWord}_name_ar`]} />
            </div>
          </div>
          {/* Branch {branchNum} Address - Bilingual */}
          <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                            Branch {branchNum} Address
            </label>
            <div className="md:col-span-4">
              <TextAreaCom
            register={register}
            label={`Branch ${branchNum} Address (English)`}
                              name={`about_page_branch_${branchWord}_address_en`}
                              placeholder="Address, City, District"
                            />
                            <Error errorName={errors[`about_page_branch_${branchWord}_address_en`]} />
            </div>
            <div className="md:col-span-4">
              <TextAreaCom
            register={register}
            label={`Branch ${branchNum} Address (Arabic)`}
                              name={`about_page_branch_${branchWord}_address_ar`}
                              placeholder="العنوان، المدينة، الحي"
                            />
                            <Error errorName={errors[`about_page_branch_${branchWord}_address_ar`]} />
            </div>
          </div>
          {/* Branch {branchNum} Phone - Bilingual */}
          <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                            Branch {branchNum} Phone
            </label>
            <div className="md:col-span-4">
              <InputAreaTwo
            register={register}
            label={`Branch ${branchNum} Phone (English)`}
                              name={`about_page_branch_${branchWord}_phone_en`}
                type="text"
                              placeholder="+966 16 123 4567"
          />
                            <Error errorName={errors[`about_page_branch_${branchWord}_phone_en`]} />
            </div>
            <div className="md:col-span-4">
              <InputAreaTwo
            register={register}
            label={`Branch ${branchNum} Phone (Arabic)`}
                              name={`about_page_branch_${branchWord}_phone_ar`}
                type="text"
                              placeholder="+966 16 123 4567"
          />
                            <Error errorName={errors[`about_page_branch_${branchWord}_phone_ar`]} />
            </div>
          </div>
          {/* Branch {branchNum} Hours - Bilingual */}
          <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                            Branch {branchNum} Hours (Optional)
            </label>
            <div className="md:col-span-4">
              <InputAreaTwo
                register={register}
                              label={`Branch ${branchNum} Hours (English)`}
                              name={`about_page_branch_${branchWord}_hours_en`}
                type="text"
                              placeholder="Daily: 7:00 AM - 11:00 PM"
              />
                            <Error errorName={errors[`about_page_branch_${branchWord}_hours_en`]} />
            </div>
            <div className="md:col-span-4">
              <InputAreaTwo
                register={register}
                              label={`Branch ${branchNum} Hours (Arabic)`}
                              name={`about_page_branch_${branchWord}_hours_ar`}
                type="text"
                              placeholder="يومياً: 7:00 ص - 11:00 م"
              />
                            <Error errorName={errors[`about_page_branch_${branchWord}_hours_ar`]} />
            </div>
          </div>

          {/* Branch {branchNum} Subtitle - Bilingual */}
          <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
              Branch {branchNum} Subtitle / Type
            </label>
            <div className="md:col-span-4">
              <InputAreaTwo
                register={register}
                label={`Branch ${branchNum} Subtitle (English)`}
                name={`about_page_branch_${branchWord}_subtitle_en`}
                type="text"
                placeholder="Main Store, Express Store, Full Service..."
              />
              <Error errorName={errors[`about_page_branch_${branchWord}_subtitle_en`]} />
            </div>
            <div className="md:col-span-4">
              <InputAreaTwo
                register={register}
                label={`Branch ${branchNum} Subtitle (Arabic)`}
                name={`about_page_branch_${branchWord}_subtitle_ar`}
                type="text"
                placeholder="متجر رئيسي، متجر سريع، خدمة كاملة..."
              />
              <Error errorName={errors[`about_page_branch_${branchWord}_subtitle_ar`]} />
            </div>
          </div>

          {/* Branch {branchNum} Services - Bilingual */}
          <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
              Branch {branchNum} Services (comma-separated)
            </label>
            <div className="md:col-span-4">
              <TextAreaCom
                register={register}
                label={`Branch ${branchNum} Services (English)`}
                name={`about_page_branch_${branchWord}_services_en`}
                placeholder="Fresh Produce, Bakery, Pharmacy, Electronics"
              />
              <Error errorName={errors[`about_page_branch_${branchWord}_services_en`]} />
            </div>
            <div className="md:col-span-4">
              <TextAreaCom
                register={register}
                label={`Branch {branchNum} Services (Arabic)`}
                name={`about_page_branch_${branchWord}_services_ar`}
                placeholder="خضار وفواكه طازجة، مخبز، صيدلية، إلكترونيات"
              />
              <Error errorName={errors[`about_page_branch_${branchWord}_services_ar`]} />
            </div>
          </div>

          {/* Branch {branchNum} Directions - Bilingual */}
          <div className="grid md:grid-cols-10 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
              Directions Link (Google Maps)
            </label>
            <div className="md:col-span-4">
              <InputAreaTwo
                register={register}
                label={`Branch ${branchNum} Directions Link (English)`}
                name={`about_page_branch_${branchWord}_directions_en`}
                type="text"
                placeholder="https://maps.google.com..."
              />
              <Error errorName={errors[`about_page_branch_${branchWord}_directions_en`]} />
        </div>
            <div className="md:col-span-4">
              <InputAreaTwo
                register={register}
                label={`Branch ${branchNum} Directions Link (Arabic)`}
                name={`about_page_branch_${branchWord}_directions_ar`}
                type="text"
                placeholder="https://maps.google.com..."
              />
              <Error errorName={errors[`about_page_branch_${branchWord}_directions_ar`]} />
        </div>
          </div>
                      </TabPanel>
                    );
                  })}
                </Tabs>
              </TabsComponent>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Submit Button */}
      <div className="flex justify-end mt-10">
        {isSubmitting ? (
          <Button disabled type="button" className="h-10 px-6">
            <img
              src={spinnerLoadingImage}
              alt="Loading"
              width={20}
              height={10}
            />
            <span className="font-serif ml-2 font-light">
              {t("Processing")}
            </span>
          </Button>
        ) : (
          <Button
            type="button"
            className="h-10 px-6"
            onClick={handleSubmit(onSubmit)}
          >
            {isSave ? t("SaveBtn") : t("UpdateBtn")}
          </Button>
        )}
      </div>
    </>
  );
};

export default AboutUs;
