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
import SelectLanguageTwo from "@/components/form/selectOption/SelectLanguageTwo";
import { useState, useContext } from "react";
import { SidebarContext } from "@/context/SidebarContext";

// Bilingual Input Component for EN/AR side-by-side fields
const BilingualInput = ({ 
  register, 
  errors, 
  baseName, 
  label, 
  type = "text", 
  placeholderEn, 
  placeholderAr,
  isTextArea = false 
}) => {
  const InputComponent = isTextArea ? TextAreaCom : InputAreaTwo;
  
  return (
    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
        {label}
      </label>
      <div className="sm:col-span-4 space-y-3">
        {/* English Input */}
        <div>
          <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
            English
          </div>
          <InputComponent
            register={register}
            label={`${label} (English)`}
            name={`${baseName}_en`}
            type={type}
            placeholder={placeholderEn}
          />
          <Error errorName={errors[`${baseName}_en`]} />
        </div>
        
        {/* Arabic Input */}
        <div>
          <div className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">
            العربية (Arabic)
          </div>
          <InputComponent
            register={register}
            label={`${label} (Arabic)`}
            name={`${baseName}_ar`}
            type={type}
            placeholder={placeholderAr}
            className="text-right"
          />
          <Error errorName={errors[`${baseName}_ar`]} />
        </div>
      </div>
    </div>
  );
};

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
  handleSelectLanguage,
}) => {
  const { t } = useTranslation();
  const { lang } = useContext(SidebarContext);
  const [selectedLanguage, setSelectedLanguage] = useState(lang || "en");

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    // Call the parent's handleSelectLanguage function
    if (handleSelectLanguage) {
      handleSelectLanguage(language);
    }
    console.log('Language changed to:', language);
  };

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
                type="submit"
                className="h-10 px-6 "
              >
                {isSave ? t("SaveBtn") : t("UpdateBtn")}
              </Button>
            )}
          </div>

          <div className="inline-flex md:text-lg text-base text-gray-800 font-semibold dark:text-gray-400 md:mb-3 mb-1">
            <FiSettings className="mt-1 mr-2" />
            {t("AboutUs")}
          </div>

          {/* Bilingual Note */}
          <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="text-blue-600 dark:text-blue-400 font-medium">
                📝 Bilingual Form
              </div>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
              All fields now support both English and Arabic side-by-side. Fill in both languages for complete coverage.
            </p>
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

              <BilingualInput
                register={register}
                errors={errors}
                baseName="about_page_title"
                label="Page Title"
                placeholderEn="About Us"
                placeholderAr="من نحن"
              />

              {/* Hero Description */}
              <BilingualInput
                register={register}
                errors={errors}
                baseName="about_page_hero_description"
                label="Hero Description"
                placeholderEn="Learn more about SAPT Markets and our story..."
                placeholderAr="تعرف على المزيد حول أسواق سابت وقصتنا..."
                isTextArea={true}
              />
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
              <BilingualInput
                register={register}
                errors={errors}
                baseName="about_page_top_section_title"
                label="Top Section Title"
                placeholderEn="A Trusted Name in Qassim Retail"
                placeholderAr="اسم موثوق في تجارة القصيم"
              />

              <BilingualInput
                register={register}
                errors={errors}
                baseName="about_page_top_section_description"
                label="Top Section Description"
                placeholderEn="At SAPT Markets, we've built our reputation on providing quality products..."
                placeholderAr="في أسواق سابت، بنينا سمعتنا على تقديم منتجات ذات جودة..."
                isTextArea={true}
              />

              <div className="grid md:grid-cols-2 gap-6 mb-6 mt-8">
                {/* Badge Line 1 */}
                <div className="md:col-span-1 col-span-2">
                  <BilingualInput
                    register={register}
                    errors={errors}
                    baseName="about_page_trusted_badge_one_pill"
                    label="Badge 1 Pill"
                    placeholderEn="Since 1989"
                    placeholderAr="منذ 1989"
                  />
                </div>
                <div className="md:col-span-1 col-span-2">
                  <BilingualInput
                    register={register}
                    errors={errors}
                    baseName="about_page_trusted_badge_one_text"
                    label="Badge 1 Text"
                    placeholderEn="From Family Business"
                    placeholderAr="منذ شركة عائلية"
                  />
                </div>

                {/* Badge Line 2 */}
                <div className="md:col-span-1 col-span-2">
                  <BilingualInput
                    register={register}
                    errors={errors}
                    baseName="about_page_trusted_badge_two_pill"
                    label="Badge 2 Pill"
                    placeholderEn="35+ Years"
                    placeholderAr="أكثر من 35 عامًا"
                  />
                </div>
                <div className="md:col-span-1 col-span-2">
                  <BilingualInput
                    register={register}
                    errors={errors}
                    baseName="about_page_trusted_badge_two_text"
                    label="Badge 2 Text"
                    placeholderEn="Serving the Community"
                    placeholderAr="خدمة المجتمع"
                  />
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

              {/* Card One */}
              <BilingualInput
                register={register}
                errors={errors}
                baseName="about_page_card_one_title"
                label="Card One Title"
                placeholderEn="Everyday Essentials"
                placeholderAr="الضروريات اليومية"
              />

              <BilingualInput
                register={register}
                errors={errors}
                baseName="about_page_card_one_subtitle"
                label="Card One Subtitle"
                placeholderEn="From Pantry to Home"
                placeholderAr="من المؤن إلى المنزل"
              />

              <BilingualInput
                register={register}
                errors={errors}
                baseName="about_page_card_one_description"
                label="Card One Description"
                placeholderEn="We offer a comprehensive range of household necessities..."
                placeholderAr="نقدم مجموعة شاملة من الضروريات المنزلية..."
                isTextArea={true}
              />

              {/* Card Two */}
              <BilingualInput
                register={register}
                errors={errors}
                baseName="about_page_card_two_title"
                label="Card Two Title"
                placeholderEn="Weekly Offers"
                placeholderAr="عروض أسبوعية"
              />

              <BilingualInput
                register={register}
                errors={errors}
                baseName="about_page_card_two_subtitle"
                label="Card Two Subtitle"
                placeholderEn="Save More, Shop Smart"
                placeholderAr="ادخر أكثر، تسوق بذكاء"
              />

              <BilingualInput
                register={register}
                errors={errors}
                baseName="about_page_card_two_description"
                label="Card Two Description"
                placeholderEn="Our regular promotional offers help families save money..."
                placeholderAr="عروضنا الترويجية المنتظمة تساعد العائلات على التوفير..."
                isTextArea={true}
              />
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
              <BilingualInput
                register={register}
                errors={errors}
                baseName="about_page_heritage_title"
                label="Heritage Title"
                placeholderEn="Our Heritage & Vision"
                placeholderAr="تراثنا ورؤيتنا"
              />

              <BilingualInput
                register={register}
                errors={errors}
                baseName="about_page_heritage_description_one"
                label="Heritage Description One"
                placeholderEn="SAPT Markets is proudly part of the Al-Muhaysini Holding family..."
                placeholderAr="أسواق سابت جزء من عائلة المهيسني القابضة..."
                isTextArea={true}
              />

              <BilingualInput
                register={register}
                errors={errors}
                baseName="about_page_heritage_description_two"
                label="Heritage Description Two"
                placeholderEn="Today, SAPT operates multiple locations throughout Buraidah..."
                placeholderAr="اليوم، تعمل أسواق سابت في مواقع متعددة في بريدة..."
                isTextArea={true}
              />

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
              <BilingualInput
                register={register}
                errors={errors}
                baseName="about_page_team_title"
                label="Team Title"
                placeholderEn="Meet the SAPT Family"
                placeholderAr="تعرف على عائلة سابت"
              />

              <BilingualInput
                register={register}
                errors={errors}
                baseName="about_page_team_description"
                label="Team Description"
                placeholderEn="Our dedicated team members are the backbone of SAPT Markets..."
                placeholderAr="أعضاء فريقنا المخلصون هم العمود الفقري لأسواق سابت..."
                isTextArea={true}
              />

                    <BilingualInput
                register={register}
                errors={errors}
                baseName="about_page_leadership_title"
                label="Leadership Title"
                placeholderEn="Leadership that Inspires"
                placeholderAr="قيادة ملهمة"
              />

              <BilingualInput
                register={register}
                errors={errors}
                baseName="about_page_leadership_subtitle"
                label="Leadership Subtitle"
                placeholderEn="Guided by Vision, Committed to Excellence"
                placeholderAr="مدفوعون برؤية، ملتزمون بالتميز"
              />

              <BilingualInput
                register={register}
                errors={errors}
                baseName="about_page_values_title"
                label="Values Title"
                placeholderEn="Our Core Values"
                placeholderAr="قيمنا الأساسية"
              />

              <BilingualInput
                register={register}
                errors={errors}
                baseName="about_page_values_description"
                label="Values Description"
                placeholderEn="These fundamental principles guide every decision we make..."
                placeholderAr="هذه المبادئ الأساسية توجه كل قرار نتخذه..."
                isTextArea={true}
              />
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
                                         <BilingualInput
                       register={register}
                       errors={errors}
                       baseName="about_page_value_one_title"
                       label="Value One Title"
                       placeholderEn="Quality First"
                       placeholderAr="الجودة أولاً"
                     />

                     <BilingualInput
                       register={register}
                       errors={errors}
                       baseName="about_page_value_one_description"
                       label="Value One Description"
                       placeholderEn="We never compromise on the quality of our products..."
                       placeholderAr="لا نساوم على جودة منتجاتنا..."
                       isTextArea={true}
                     />
                  </TabPanel>

                  <TabPanel>
                    <BilingualInput
                      register={register}
                      errors={errors}
                      baseName="about_page_value_two_title"
                      label="Value Two Title"
                      placeholderEn="Customer Care"
                      placeholderAr="رعاية العملاء"
                    />

                    <BilingualInput
                      register={register}
                      errors={errors}
                      baseName="about_page_value_two_description"
                      label="Value Two Description"
                      placeholderEn="Every customer is valued and deserves exceptional service..."
                      placeholderAr="نقدّر كل عميل ونلتزم بخدمته بأفضل ما يمكن..."
                      isTextArea={true}
                    />
                  </TabPanel>

                  <TabPanel>
                                         <BilingualInput
                       register={register}
                       errors={errors}
                       baseName="about_page_value_three_title"
                       label="Value Three Title"
                       placeholderEn="Community Focus"
                       placeholderAr="التركيز على المجتمع"
                     />

                     <BilingualInput
                       register={register}
                       errors={errors}
                       baseName="about_page_value_three_description"
                       label="Value Three Description"
                       placeholderEn="We're not just a store; we're part of the Qassim community..."
                       placeholderAr="نحن لسنا مجرد متجر؛ نحن جزء من مجتمع القصيم..."
                       isTextArea={true}
                     />
                  </TabPanel>

                  <TabPanel>
                                         <BilingualInput
                       register={register}
                       errors={errors}
                       baseName="about_page_value_four_title"
                       label="Value Four Title"
                       placeholderEn="Innovation"
                       placeholderAr="الابتكار"
                     />

                     <BilingualInput
                       register={register}
                       errors={errors}
                       baseName="about_page_value_four_description"
                       label="Value Four Description"
                       placeholderEn="We continuously evolve to meet changing customer needs..."
                       placeholderAr="نواصل التطور لتلبية احتياجات العملاء المتغيرة..."
                       isTextArea={true}
                     />
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
                    <BilingualInput
                      register={register}
                      errors={errors}
                      baseName="about_page_founder_one_name"
                      label="Member 1 Name"
                      placeholderEn="Ahmed Al-Muhaysini"
                      placeholderAr="أحمد المحيسني"
                    />
                    <BilingualInput
                      register={register}
                      errors={errors}
                      baseName="about_page_founder_one_position"
                      label="Member 1 Position"
                      placeholderEn="Founder & CEO"
                      placeholderAr="المؤسس والرئيس التنفيذي"
                    />
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
                    <BilingualInput
                      register={register}
                      errors={errors}
                      baseName="about_page_founder_two_name"
                      label="Member 2 Name"
                      placeholderEn="Omar Saleh"
                      placeholderAr="عمر صالح"
                    />
                    <BilingualInput
                      register={register}
                      errors={errors}
                      baseName="about_page_founder_two_position"
                      label="Member 2 Position"
                      placeholderEn="COO"
                      placeholderAr="المدير التنفيذي للعمليات"
                    />
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
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 3 Name
            </label>
                      <BilingualInput
            register={register}
            errors={errors}
            baseName="about_page_founder_three_name"
            label="Member 3 Name"
            placeholderEn="Mohammad Ali"
            placeholderAr="محمد علي"
          />
          </div>
                    <BilingualInput
            register={register}
            errors={errors}
            baseName="about_page_founder_three_position"
            label="Member 3 Position"
            placeholderEn="CTO"
            placeholderAr="المدير التقني"
          />
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
                    <BilingualInput
                      register={register}
                      errors={errors}
                      baseName="about_page_founder_four_name"
                      label="Member 4 Name"
                      placeholderEn="Member 4 Name"
                      placeholderAr="اسم العضو 4"
                    />
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 4 Position
                  </label>
            <BilingualInput
              register={register}
              errors={errors}
              baseName="about_page_founder_four_position"
              label="Member 4 Position"
              placeholderEn="Member 4 Position"
              placeholderAr="منصب العضو 4"
            />
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
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 5 Name
                  </label>
            <BilingualInput
            register={register}
            errors={errors}
            baseName="about_page_founder_five_name"
            label="Member 5 Name"
            placeholderEn="Member 5 Name"
            placeholderAr="اسم العضو 5"
          />
                    </div>
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 5 Position
                  </label>
                      <BilingualInput
            register={register}
            errors={errors}
            baseName="about_page_founder_five_position"
            label="Member 5 Position"
            placeholderEn="Member 5 Position"
            placeholderAr="منصب العضو 5"
          />
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
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 6 Name
            </label>
            <BilingualInput
              register={register}
              errors={errors}
              baseName="about_page_founder_six_name"
              label="Member 6 Name"
              placeholderEn="Member 6 Name"
              placeholderAr="اسم العضو 6"
            />
          </div>
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 6 Position
            </label>
            <BilingualInput
              register={register}
              errors={errors}
              baseName="about_page_founder_six_position"
              label="Member 6 Position"
              placeholderEn="Member 6 Position"
              placeholderAr="منصب العضو 6"
            />
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
            <BilingualInput
              register={register}
              errors={errors}
              baseName="about_page_founder_seven_name"
              label="Member 7 Name"
              placeholderEn="Member 7 Name"
              placeholderAr="اسم العضو 7"
            />
          </div>
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 7 Position
                  </label>
            <BilingualInput
              register={register}
              errors={errors}
              baseName="about_page_founder_seven_position"
              label="Member 7 Position"
              placeholderEn="Member 7 Position"
              placeholderAr="منصب العضو 7"
            />
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
                      <BilingualInput
              register={register}
              errors={errors}
              baseName="about_page_founder_eight_name"
              label="Member 8 Name"
              placeholderEn="Member 8 Name"
              placeholderAr="اسم العضو 8"
            />
              </div>
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 8 Position
            </label>
                        <BilingualInput
              register={register}
              errors={errors}
              baseName="about_page_founder_eight_position"
              label="Member 8 Position"
              placeholderEn="Member 8 Position"
              placeholderAr="منصب العضو 8"
            />
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
            <BilingualInput
              register={register}
              errors={errors}
              baseName="about_page_founder_nine_name"
              label="Member 9 Name"
              placeholderEn="Member 9 Name"
              placeholderAr="اسم العضو 9"
            />
          </div>
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 9 Position
            </label>
                        <BilingualInput
              register={register}
              errors={errors}
              baseName="about_page_founder_nine_position"
              label="Member 9 Position"
              placeholderEn="Member 9 Position"
              placeholderAr="منصب العضو 9"
            />
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
                      <BilingualInput
              register={register}
              errors={errors}
              baseName="about_page_founder_ten_name"
              label="Member 10 Name"
              placeholderEn="Member 10 Name"
              placeholderAr="اسم العضو 10"
            />
                    </div>
                    <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
                      <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 10 Position
                  </label>
                      <BilingualInput
              register={register}
              errors={errors}
              baseName="about_page_founder_ten_position"
              label="Member 10 Position"
              placeholderEn="Member 10 Position"
              placeholderAr="منصب العضو 10"
            />
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
                      <BilingualInput
              register={register}
              errors={errors}
              baseName="about_page_founder_eleven_name"
              label="Member 11 Name"
              placeholderEn="Member 11 Name"
              placeholderAr="اسم العضو 11"
            />
                </div>
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 11 Position
                  </label>
            <BilingualInput
              register={register}
              errors={errors}
              baseName="about_page_founder_eleven_position"
              label="Member 11 Position"
              placeholderEn="Member 11 Position"
              placeholderAr="منصب العضو 11"
            />
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
            <BilingualInput
              register={register}
              errors={errors}
              baseName="about_page_founder_twelve_name"
              label="Member 12 Name"
              placeholderEn="Member 12 Name"
              placeholderAr="اسم العضو 12"
            />
          </div>
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                        Member 12 Position
                  </label>
            <BilingualInput
              register={register}
              errors={errors}
              baseName="about_page_founder_twelve_position"
              label="Member 12 Position"
              placeholderEn="Member 12 Position"
              placeholderAr="منصب العضو 12"
            />
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
              <BilingualInput
                register={register}
                errors={errors}
                baseName="about_page_branches_title"
                label="Branches Title"
                placeholderEn="Our Locations"
                placeholderAr="مواقعنا"
              />

              <BilingualInput
                register={register}
                errors={errors}
                baseName="about_page_branches_description"
                label="Branches Description"
                placeholderEn="Visit any of our convenient locations throughout Buraidah..."
                placeholderAr="قم بزيارة أي من مواقعنا المريحة في بريدة..."
                isTextArea={true}
              />

              <BilingualInput
                register={register}
                errors={errors}
                baseName="about_page_branches_cta_title"
                label="Branches CTA Title"
                placeholderEn="Can't Find Us?"
                placeholderAr="لا يمكنك العثور علينا؟"
              />

              <BilingualInput
                register={register}
                errors={errors}
                baseName="about_page_branches_cta_description"
                label="Branches CTA Description"
                placeholderEn="We're expanding! New locations opening soon."
                placeholderAr="نحن نتوسع! سيتم افتتاح مواقع جديدة قريبًا."
                isTextArea={true}
              />

              <BilingualInput
                register={register}
                errors={errors}
                baseName="about_page_upcoming_branches_title"
                label="Upcoming Branches Title"
                placeholderEn="Coming Soon to New Areas"
                placeholderAr="قريبًا في مناطق جديدة"
              />

              {/* Upcoming Branches (Static Two) */}
              <div className="inline-flex md:text-base text-sm mb-3 mt-8 text-gray-500 dark:text-gray-400">
                <strong>Upcoming Branches</strong>
              </div>

              {[1, 2].map((num) => (
                <div key={num} className="border p-4 rounded-lg mb-6">
                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                      Branch {num} Name
            </label>
            <div className="sm:col-span-4">
              <BilingualInput
                register={register}
                errors={errors}
                baseName={`about_page_upcoming_branch_${num === 1 ? 'one' : 'two'}_name`}
                label={`Upcoming Branch ${num} Name`}
                placeholderEn={`SAPT Upcoming Branch ${num}`}
                placeholderAr={`فرع أسواق سابت القادم ${num}`}
              />
            </div>
          </div>

                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                      Address / Details
            </label>
            <div className="sm:col-span-4">
              <BilingualInput
                register={register}
                errors={errors}
                baseName={`about_page_upcoming_branch_${num === 1 ? 'one' : 'two'}_address`}
                label={`Upcoming Branch ${num} Address`}
                placeholderEn="District, City"
                placeholderAr="الحي، المدينة"
                isTextArea={true}
              />
            </div>
          </div>

                  {/* Quarter */}
                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mt-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                      Opening Quarter (e.g., Q2 2025)
            </label>
            <div className="sm:col-span-4">
              <InputAreaTwo
                register={register}
                        label={`Upcoming Branch ${num} Quarter`}
                        name={`about_page_upcoming_branch_${num === 1 ? 'one' : 'two'}_quarter`}
                type="text"
                        placeholder="Q2 2025"
              />
            </div>
          </div>

                  {/* Planned Features */}
                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mt-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                      Planned Features (comma-separated)
            </label>
            <div className="sm:col-span-4">
              <TextAreaCom
                register={register}
                        label={`Upcoming Branch ${num} Features`}
                        name={`about_page_upcoming_branch_${num === 1 ? 'one' : 'two'}_features`}
                        placeholder="Largest Store, Food Court, Pharmacy"
                      />
            </div>
          </div>

                  {/* Emoji / Icon */}
                  <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mt-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                      Emoji Icon (single emoji)
            </label>
            <div className="sm:col-span-4">
                      <InputAreaTwo
                register={register}
                        label={`Upcoming Branch ${num} Emoji`}
                        name={`about_page_upcoming_branch_${num === 1 ? 'one' : 'two'}_emoji`}
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
          <BilingualInput
            register={register}
            errors={errors}
            baseName={`about_page_branch_${branchWord}_name`}
            label={`Branch ${branchNum} Name`}
            placeholderEn={`SAPT Markets Branch ${branchNum}`}
            placeholderAr={`فرع أسواق سابت ${branchNum}`}
          />
          <BilingualInput
            register={register}
            errors={errors}
            baseName={`about_page_branch_${branchWord}_address`}
            label={`Branch ${branchNum} Address`}
            placeholderEn="123 Main Street, Buraidah, Al-Qassim"
            placeholderAr="شارع الملك عبد العزيز، بريدة، القصيم"
            isTextArea={true}
          />
          <BilingualInput
            register={register}
            errors={errors}
            baseName={`about_page_branch_${branchWord}_phone`}
            label={`Branch ${branchNum} Phone`}
            placeholderEn="+966 16 123 4567"
            placeholderAr="+966 16 123 4567"
          />
          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
                            Branch {branchNum} Hours (Optional)
            </label>
            <div className="sm:col-span-4">
              <InputAreaTwo
                register={register}
                              label={`Branch ${branchNum} Hours`}
                              name={`about_page_branch_${branchWord}_hours`}
                type="text"
                              placeholder="Daily: 7:00 AM - 11:00 PM"
              />
                            <Error errorName={errors[`about_page_branch_${branchWord}_hours`]} />
            </div>
          </div>

          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
              Branch {branchNum} Subtitle / Type
            </label>
            <div className="sm:col-span-4">
              <InputAreaTwo
                register={register}
                label={`Branch ${branchNum} Subtitle`}
                name={`about_page_branch_${branchWord}_subtitle`}
                type="text"
                placeholder="Main Store, Express Store, Full Service..."
              />
              <Error errorName={errors[`about_page_branch_${branchWord}_subtitle`]} />
            </div>
          </div>

          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
              Branch {branchNum} Services (comma-separated)
            </label>
            <div className="sm:col-span-4">
              <TextAreaCom
                register={register}
                label={`Branch ${branchNum} Services`}
                name={`about_page_branch_${branchWord}_services`}
                placeholder="Fresh Produce, Bakery, Pharmacy, Electronics"
              />
              <Error errorName={errors[`about_page_branch_${branchWord}_services`]} />
            </div>
          </div>

          <div className="grid md:grid-cols-5 sm:grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 md:mb-6 mb-3">
            <label className="block md:text-sm md:col-span-1 sm:col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 md:mb-1">
              Directions Link (Google Maps)
            </label>
            <div className="sm:col-span-4">
              <InputAreaTwo
                register={register}
                label={`Branch ${branchNum} Directions Link`}
                name={`about_page_branch_${branchWord}_directions`}
                type="text"
                placeholder="https://maps.google.com..."
              />
              <Error errorName={errors[`about_page_branch_${branchWord}_directions`]} />
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
    </>
  );
};

export default AboutUs;
