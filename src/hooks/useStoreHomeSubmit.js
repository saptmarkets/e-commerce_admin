import { EditorState, convertToRaw } from "draft-js";
import { stateFromHTML } from "draft-js-import-html";
import draftToHtml from "draftjs-to-html";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

//internal import
import useUtilsFunction from "./useUtilsFunction";
import useDisableForDemo from "./useDisableForDemo";
import { notifyError, notifySuccess } from "@/utils/toast";
import { SidebarContext } from "@/context/SidebarContext";
import SettingServices from "@/services/SettingServices";
import CouponServices from "@/services/CouponServices";

const createEditorState = (text) => {
  const contentState = stateFromHTML(text);
  return EditorState.createWithContent(contentState);
};

const useStoreHomeSubmit = () => {
  const { setIsUpdate, lang } = useContext(SidebarContext);
  const { showingTranslateValue } = useUtilsFunction();

  const [resData, setResData] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [couponList, setCouponList] = useState([]);
  const [couponList1, setCouponList1] = useState([]);
  const [language, setLanguage] = useState("en");

  const [isSave, setIsSave] = useState(true);
  const [printSlip, setPrintSlip] = useState(true);
  const [emailSlip, setEmailSlip] = useState(true);
  const [isCoupon, setIsCoupon] = useState(true);
  const [allowDiscount, setAllowDiscount] = useState(true);
  const [paymentOption, setPaymentOption] = useState(true);
  const [orderProcess, setOrderProcess] = useState(true);
  const [allowOutOfStock, setAllowOutOfStock] = useState(true);
  const [isSliderFullWidth, setIsSliderFullWidth] = useState(false);
  const [isPlaceholder, setIsPlaceholder] = useState(true);
  const [promotionBanner, setPromotionBanner] = useState(true);
  const [featuredCategories, setFeaturedCategories] = useState(true);
  const [popularProducts, setPopularProducts] = useState(true);
  const [quickDelivery, setQuickDelivery] = useState(true);
  const [latestDiscounted, setLatestDiscounted] = useState(true);
  const [dailyNeeds, setDailyNeeds] = useState(true);
  const [featurePromo, setFeaturePromo] = useState(true);
  const [footerBlock1, setFooterBlock1] = useState(true);
  const [footerBlock2, setFooterBlock2] = useState(true);
  const [footerBlock3, setFooterBlock3] = useState(true);
  const [footerBlock4, setFooterBlock4] = useState(true);
  const [footerSocialLinks, setFooterSocialLinks] = useState(true);
  const [footerPaymentMethod, setFooterPaymentMethod] = useState(true);
  const [footerBottomContact, setFooterBottomContact] = useState(true);
  const [allowPromotionBanner, setAllowPromotionBanner] = useState(false);
  const [discount_coupon_status, setDiscount_coupon_status] = useState(true);
  const [singleProductPageRightBox, setSingleProductPageRightBox] =
    useState(true);
  const [leftRightArrow, setLeftRightArrow] = useState(false);
  const [bottomDots, setBottomDots] = useState(true);
  const [bothSliderOption, setBothSliderOption] = useState(true);

  const [faqMenuLink, setFaqMenuLink] = useState(true);
  const [emailUsBox, setEmailUsBox] = useState(true);
  const [callUsBox, setCallUsBox] = useState(true);
  const [addressBox, setAddressBox] = useState(true);
  const [faqStatus, setFaqStatus] = useState(true);
  const [offersMenuLink, setOffersMenuLink] = useState(true);
  const [privacyPolicy, setPrivacyPolicy] = useState(true);
  const [termsConditions, setTermsConditions] = useState(true);
  const [faqLeftColStatus, setFaqLeftColStatus] = useState(true);
  const [faqRightColStatus, setFaqRightColStatus] = useState(true);
  const [offersPageHeader, setOffersPageHeader] = useState(true);
  const [aboutPageHeader, setAboutPageHeader] = useState(true);
  const [categoriesMenuLink, setCategoriesMenuLink] = useState(true);
  const [aboutUsMenuLink, setAboutUsMenuLink] = useState(true);
  const [contactUsMenuLink, setContactUsMenuLink] = useState(true);
  const [contactPageHeader, setContactPageHeader] = useState(true);
  const [contactFormStatus, setContactFormStatus] = useState(true);
  const [ourFounderSection, setOurFounderSection] = useState(true);
  const [aboutTopContentLeft, setAboutTopContentLeft] = useState(true);
  const [aboutTopContentRight, setAboutTopContentRight] = useState(true);
  const [privacyPolicyMenuLink, setPrivacyPolicyMenuLink] = useState(true);
  const [termsConditionsMenuLink, setTermsConditionsMenuLink] = useState(true);
  const [contactMidLeftColStatus, setContactMidLeftColStatus] = useState(true);
  const [contactMidLeftColImage, setContactMidLeftColImage] = useState("");
  const [aboutMiddleContentSection, setAboutMiddleContentSection] =
    useState(true);

  const [metaImg, setMetaImg] = useState("");
  const [favicon, setFavicon] = useState("");
  const [footerLogo, setFooterLogo] = useState("");
  const [headerLogo, setHeaderLogo] = useState("");
  const [sliderImage, setSliderImage] = useState("");
  const [paymentImage, setPaymentImage] = useState("");
  const [faqHeaderBg, setFaqHeaderBg] = useState("");
  const [aboutHeaderBg, setAboutHeaderBg] = useState("");
  const [offersHeaderBg, setOffersHeaderBg] = useState("");
  const [sliderImageTwo, setSliderImageTwo] = useState("");
  const [getButton1image, setGetButton1image] = useState("");
  const [getButton2image, setGetButton2image] = useState("");
  const [faqLeftColImage, setFaqLeftColImage] = useState("");
  const [contactHeaderBg, setContactHeaderBg] = useState("");
  const [sliderImageThree, setSliderImageThree] = useState("");
  const [sliderImageFour, setSliderImageFour] = useState("");
  const [sliderImageFive, setSliderImageFive] = useState("");
  const [placeholderImage, setPlaceHolderImage] = useState("");
  const [quickSectionImage, setQuickSectionImage] = useState("");
  const [ourFounderOneImage, setOurFounderOneImage] = useState("");
  const [ourFounderTwoImage, setOurFounderTwoImage] = useState("");
  const [ourFounderThreeImage, setOurFounderThreeImage] = useState("");
  const [ourFounderFourImage, setOurFounderFourImage] = useState("");
  const [ourFounderFiveImage, setOurFounderFiveImage] = useState("");
  const [ourFounderSixImage, setOurFounderSixImage] = useState("");

  // Additional founder images for extended team
  const [ourFounderSevenImage, setOurFounderSevenImage] = useState("");
  const [ourFounderEightImage, setOurFounderEightImage] = useState("");
  const [ourFounderNineImage, setOurFounderNineImage] = useState("");
  const [ourFounderTenImage, setOurFounderTenImage] = useState("");
  const [ourFounderElevenImage, setOurFounderElevenImage] = useState("");
  const [ourFounderTwelveImage, setOurFounderTwelveImage] = useState("");

  // About Us section toggles
  const [aboutCoreValues, setAboutCoreValues] = useState(true);
  const [aboutBranches, setAboutBranches] = useState(true);
  const [aboutMiddleContentImage, setAboutMiddleContentImage] = useState("");
  const [privacyPolicyHeaderBg, setPrivacyPolicyHeaderBg] = useState("");
  const [getYourDailyNeedImageLeft, setGetYourDailyNeedImageLeft] =
    useState("");
  const [getYourDailyNeedImageRight, setGetYourDailyNeedImageRight] =
    useState("");
  const [textEdit, setTextEdit] = useState(createEditorState(""));
  const [termsConditionsTextEdit, setTermsConditionsTextEdit] = useState(
    createEditorState("")
  );
  const [aboutTopContentRightImage, setAboutTopContentRightImage] =
    useState("");
  const [termsConditionsHeaderBg, setTermsConditionsHeaderBg] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleDisableForDemo } = useDisableForDemo();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      about_page_upcoming_branch_one_name: "",
      about_page_upcoming_branch_one_address: "",
      about_page_upcoming_branch_two_name: "",
      about_page_upcoming_branch_two_address: "",
      about_page_upcoming_branch_one_quarter: "",
      about_page_upcoming_branch_one_features: "",
      about_page_upcoming_branch_one_emoji: "",
      about_page_upcoming_branch_two_quarter: "",
      about_page_upcoming_branch_two_features: "",
      about_page_upcoming_branch_two_emoji: "",
      about_page_title_en: "",
      about_page_title_ar: "",
      about_page_hero_description_en: "",
      about_page_hero_description_ar: "",
      about_page_top_section_title_en: "",
      about_page_top_section_title_ar: "",
      about_page_top_section_description_en: "",
      about_page_top_section_description_ar: "",
      about_page_trusted_badge_one_pill_en: "",
      about_page_trusted_badge_one_pill_ar: "",
      about_page_trusted_badge_one_text_en: "",
      about_page_trusted_badge_one_text_ar: "",
      about_page_trusted_badge_two_pill_en: "",
      about_page_trusted_badge_two_pill_ar: "",
      about_page_trusted_badge_two_text_en: "",
      about_page_trusted_badge_two_text_ar: "",
      // Founder One - Bilingual
      about_page_founder_one_name_en: "",
      about_page_founder_one_name_ar: "",
      about_page_founder_one_position_en: "",
      about_page_founder_one_position_ar: "",
      // Founder Two - Bilingual
      about_page_founder_two_name_en: "",
      about_page_founder_two_name_ar: "",
      about_page_founder_two_position_en: "",
      about_page_founder_two_position_ar: "",
      // Founder Three - Bilingual
      about_page_founder_three_name_en: "",
      about_page_founder_three_name_ar: "",
      about_page_founder_three_position_en: "",
      about_page_founder_three_position_ar: "",
      // Founder Four - Bilingual
      about_page_founder_four_name_en: "",
      about_page_founder_four_name_ar: "",
      about_page_founder_four_position_en: "",
      about_page_founder_four_position_ar: "",
      // Founder Five - Bilingual
      about_page_founder_five_name_en: "",
      about_page_founder_five_name_ar: "",
      about_page_founder_five_position_en: "",
      about_page_founder_five_position_ar: "",
      // Founder Six - Bilingual
      about_page_founder_six_name_en: "",
      about_page_founder_six_name_ar: "",
      about_page_founder_six_position_en: "",
      about_page_founder_six_position_ar: "",
      // Founder Seven - Bilingual
      about_page_founder_seven_name_en: "",
      about_page_founder_seven_name_ar: "",
      about_page_founder_seven_position_en: "",
      about_page_founder_seven_position_ar: "",
      // Founder Eight - Bilingual
      about_page_founder_eight_name_en: "",
      about_page_founder_eight_name_ar: "",
      about_page_founder_eight_position_en: "",
      about_page_founder_eight_position_ar: "",
      // Founder Nine - Bilingual
      about_page_founder_nine_name_en: "",
      about_page_founder_nine_name_ar: "",
      about_page_founder_nine_position_en: "",
      about_page_founder_nine_position_ar: "",
      // Founder Ten - Bilingual
      about_page_founder_ten_name_en: "",
      about_page_founder_ten_name_ar: "",
      about_page_founder_ten_position_en: "",
      about_page_founder_ten_position_ar: "",
      // Founder Eleven - Bilingual
      about_page_founder_eleven_name_en: "",
      about_page_founder_eleven_name_ar: "",
      about_page_founder_eleven_position_en: "",
      about_page_founder_eleven_position_ar: "",
      // Founder Twelve - Bilingual
      about_page_founder_twelve_name_en: "",
      about_page_founder_twelve_name_ar: "",
      about_page_founder_twelve_position_en: "",
      about_page_founder_twelve_position_ar: "",
      
      // Branches Section - Bilingual
      about_page_branches_title_en: "",
      about_page_branches_title_ar: "",
      about_page_branches_description_en: "",
      about_page_branches_description_ar: "",
      about_page_branches_cta_title_en: "",
      about_page_branches_cta_title_ar: "",
      about_page_branches_cta_description_en: "",
      about_page_branches_cta_description_ar: "",
      
      // Upcoming Branches Section - Bilingual
      about_page_upcoming_branches_title_en: "",
      about_page_upcoming_branches_title_ar: "",
      
      // Upcoming Branch One - Bilingual
      about_page_upcoming_branch_one_name_en: "",
      about_page_upcoming_branch_one_name_ar: "",
      about_page_upcoming_branch_one_address_en: "",
      about_page_upcoming_branch_one_address_ar: "",
      about_page_upcoming_branch_one_quarter_en: "",
      about_page_upcoming_branch_one_quarter_ar: "",
      about_page_upcoming_branch_one_features_en: "",
      about_page_upcoming_branch_one_features_ar: "",
      about_page_upcoming_branch_one_emoji_en: "",
      about_page_upcoming_branch_one_emoji_ar: "",
      
      // Upcoming Branch Two - Bilingual
      about_page_upcoming_branch_two_name_en: "",
      about_page_upcoming_branch_two_name_ar: "",
      about_page_upcoming_branch_two_address_en: "",
      about_page_upcoming_branch_two_address_ar: "",
      about_page_upcoming_branch_two_quarter_en: "",
      about_page_upcoming_branch_two_quarter_ar: "",
      about_page_upcoming_branch_two_features_en: "",
      about_page_upcoming_branch_two_features_ar: "",
      about_page_upcoming_branch_two_emoji_en: "",
      about_page_upcoming_branch_two_emoji_ar: "",
      
      // Current Branches 1-8 - Bilingual
      about_page_branch_one_name_en: "",
      about_page_branch_one_name_ar: "",
      about_page_branch_one_address_en: "",
      about_page_branch_one_address_ar: "",
      about_page_branch_one_phone_en: "",
      about_page_branch_one_phone_ar: "",
      about_page_branch_one_hours_en: "",
      about_page_branch_one_hours_ar: "",
      about_page_branch_one_subtitle_en: "",
      about_page_branch_one_subtitle_ar: "",
      about_page_branch_one_services_en: "",
      about_page_branch_one_services_ar: "",
      about_page_branch_one_directions_en: "",
      about_page_branch_one_directions_ar: "",
      
      about_page_branch_two_name_en: "",
      about_page_branch_two_name_ar: "",
      about_page_branch_two_address_en: "",
      about_page_branch_two_address_ar: "",
      about_page_branch_two_phone_en: "",
      about_page_branch_two_phone_ar: "",
      about_page_branch_two_hours_en: "",
      about_page_branch_two_hours_ar: "",
      about_page_branch_two_subtitle_en: "",
      about_page_branch_two_subtitle_ar: "",
      about_page_branch_two_services_en: "",
      about_page_branch_two_services_ar: "",
      about_page_branch_two_directions_en: "",
      about_page_branch_two_directions_ar: "",
      
      about_page_branch_three_name_en: "",
      about_page_branch_three_name_ar: "",
      about_page_branch_three_address_en: "",
      about_page_branch_three_address_ar: "",
      about_page_branch_three_phone_en: "",
      about_page_branch_three_phone_ar: "",
      about_page_branch_three_hours_en: "",
      about_page_branch_three_hours_ar: "",
      about_page_branch_three_subtitle_en: "",
      about_page_branch_three_subtitle_ar: "",
      about_page_branch_three_services_en: "",
      about_page_branch_three_services_ar: "",
      about_page_branch_three_directions_en: "",
      about_page_branch_three_directions_ar: "",
      
      about_page_branch_four_name_en: "",
      about_page_branch_four_name_ar: "",
      about_page_branch_four_address_en: "",
      about_page_branch_four_address_ar: "",
      about_page_branch_four_phone_en: "",
      about_page_branch_four_phone_ar: "",
      about_page_branch_four_hours_en: "",
      about_page_branch_four_hours_ar: "",
      about_page_branch_four_subtitle_en: "",
      about_page_branch_four_subtitle_ar: "",
      about_page_branch_four_services_en: "",
      about_page_branch_four_services_ar: "",
      about_page_branch_four_directions_en: "",
      about_page_branch_four_directions_ar: "",
      
      about_page_branch_five_name_en: "",
      about_page_branch_five_name_ar: "",
      about_page_branch_five_address_en: "",
      about_page_branch_five_address_ar: "",
      about_page_branch_five_phone_en: "",
      about_page_branch_five_phone_ar: "",
      about_page_branch_five_hours_en: "",
      about_page_branch_five_hours_ar: "",
      about_page_branch_five_subtitle_en: "",
      about_page_branch_five_subtitle_ar: "",
      about_page_branch_five_services_en: "",
      about_page_branch_five_services_ar: "",
      about_page_branch_five_directions_en: "",
      about_page_branch_five_directions_ar: "",
      
      about_page_branch_six_name_en: "",
      about_page_branch_six_name_ar: "",
      about_page_branch_six_address_en: "",
      about_page_branch_six_address_ar: "",
      about_page_branch_six_phone_en: "",
      about_page_branch_six_phone_ar: "",
      about_page_branch_six_hours_en: "",
      about_page_branch_six_hours_ar: "",
      about_page_branch_six_subtitle_en: "",
      about_page_branch_six_subtitle_ar: "",
      about_page_branch_six_services_en: "",
      about_page_branch_six_services_ar: "",
      about_page_branch_six_directions_en: "",
      about_page_branch_six_directions_ar: "",
      
      about_page_branch_seven_name_en: "",
      about_page_branch_seven_name_ar: "",
      about_page_branch_seven_address_en: "",
      about_page_branch_seven_address_ar: "",
      about_page_branch_seven_phone_en: "",
      about_page_branch_seven_phone_ar: "",
      about_page_branch_seven_hours_en: "",
      about_page_branch_seven_hours_ar: "",
      about_page_branch_seven_subtitle_en: "",
      about_page_branch_seven_subtitle_ar: "",
      about_page_branch_seven_services_en: "",
      about_page_branch_seven_services_ar: "",
      about_page_branch_seven_directions_en: "",
      about_page_branch_seven_directions_ar: "",
      
      about_page_branch_eight_name_en: "",
      about_page_branch_eight_name_ar: "",
      about_page_branch_eight_address_en: "",
      about_page_branch_eight_address_ar: "",
      about_page_branch_eight_phone_en: "",
      about_page_branch_eight_phone_ar: "",
      about_page_branch_eight_hours_en: "",
      about_page_branch_eight_hours_ar: "",
      about_page_branch_eight_subtitle_en: "",
      about_page_branch_eight_subtitle_ar: "",
      about_page_branch_eight_services_en: "",
      about_page_branch_eight_services_ar: "",
      about_page_branch_eight_directions_en: "",
      about_page_branch_eight_directions_ar: "",
    },
  });

  const handleRemoveEmptyKey = (obj) => {
    // For bilingual fields, we want to keep empty strings to maintain structure
    // Only delete completely undefined or null values
    for (const key in obj) {
      if (obj[key] === undefined || obj[key] === null) {
        delete obj[key];
      }
    }
    return obj;
  };

  const onSubmit = async (data) => {
    console.log("🚀 === ONSUBMIT FUNCTION CALLED ===");
    console.log("🔍 Full form data:", data);
    
    if (handleDisableForDemo()) {
      console.log("❌ Demo mode disabled, exiting");
      return; // Exit the function if the feature is disabled
    }
    
    console.log("🔍 Team members data received:", {
      founder_two_name_en: data.about_page_founder_two_name_en,
      founder_two_name_ar: data.about_page_founder_two_name_ar,
      founder_two_position_en: data.about_page_founder_two_position_en,
      founder_two_position_ar: data.about_page_founder_two_position_ar,
      founder_three_name_en: data.about_page_founder_three_name_en,
      founder_three_name_ar: data.about_page_founder_three_name_ar,
      founder_three_position_en: data.about_page_founder_three_position_en,
      founder_three_position_ar: data.about_page_founder_three_position_ar,
      founder_four_name_en: data.about_page_founder_four_name_en,
      founder_four_name_ar: data.about_page_founder_four_name_ar,
      founder_four_position_en: data.about_page_founder_four_position_en,
      founder_four_position_ar: data.about_page_founder_four_position_ar,
      founder_five_name_en: data.about_page_founder_five_name_en,
      founder_five_name_ar: data.about_page_founder_five_name_ar,
      founder_five_position_en: data.about_page_founder_five_position_en,
      founder_five_position_ar: data.about_page_founder_five_position_ar,
      founder_six_name_en: data.about_page_founder_six_name_en,
      founder_six_name_ar: data.about_page_founder_six_name_ar,
      founder_six_position_en: data.about_page_founder_six_position_en,
      founder_six_position_ar: data.about_page_founder_six_position_ar,
    });
    
    try {
      setIsSubmitting(true);

      const storeCustomizationSettingData = {
        name: "storeCustomizationSetting",
        setting: {
          navbar: {
            categories_menu_status: categoriesMenuLink,
            about_menu_status: aboutUsMenuLink,
            contact_menu_status: contactUsMenuLink,
            offers_menu_status: offersMenuLink,
            term_and_condition_status: termsConditionsMenuLink,
            privacy_policy_status: privacyPolicyMenuLink,
            faq_status: faqMenuLink,
            help_text: handleRemoveEmptyKey({
              ...resData?.navbar?.help_text,
              [language]: data.help_text || "",
            }),
            categories: handleRemoveEmptyKey({
              ...resData?.navbar?.categories,
              [language]: data.categories || "",
            }),
            about_us: handleRemoveEmptyKey({
              ...resData?.navbar?.about_us,
              [language]: data.about_us || "",
            }),
            contact_us: handleRemoveEmptyKey({
              ...resData?.navbar?.contact_us,
              [language]: data.contact_us || "",
            }),
            offers: handleRemoveEmptyKey({
              ...resData?.navbar?.offers,
              [language]: data.offers || "",
            }),
            faq: handleRemoveEmptyKey({
              ...resData?.navbar?.faq,
              [language]: data.faq || "",
            }),
            privacy_policy: handleRemoveEmptyKey({
              ...resData?.navbar?.privacy_policy,
              [language]: data.privacy_policy || "",
            }),
            term_and_condition: handleRemoveEmptyKey({
              ...resData?.navbar?.term_and_condition,
              [language]: data.term_and_condition || "",
            }),

            pages: handleRemoveEmptyKey({
              ...resData?.navbar?.pages,
              [language]: data.pages || "",
            }),
            my_account: handleRemoveEmptyKey({
              ...resData?.navbar?.my_account,
              [language]: data.my_account || "",
            }),
            login: handleRemoveEmptyKey({
              ...resData?.navbar?.login,
              [language]: data.login || "",
            }),
            logout: handleRemoveEmptyKey({
              ...resData?.navbar?.logout,
              [language]: data.logout || "",
            }),
            checkout: handleRemoveEmptyKey({
              ...resData?.navbar?.checkout,
              [language]: data.checkout || "",
            }),
            phone: data.phone_number,
            logo: headerLogo,
          },
          home: {
            coupon_status: isCoupon,
            featured_status: featuredCategories,
            discount_status: latestDiscounted,
            daily_needs_status: dailyNeeds,

            slider_width_status: isSliderFullWidth,
            promotion_banner_status: allowPromotionBanner,
            delivery_status: quickDelivery,
            popular_products_status: popularProducts,
            discount_product_status: latestDiscounted,
            discount_coupon_code: couponList?.map((coupon) => coupon?.value),
            place_holder_img: placeholderImage,
            feature_promo_status: featurePromo,

            quick_delivery_link: data.quick_delivery_link,
            quick_delivery_img: quickSectionImage,

            discount_title: handleRemoveEmptyKey({
              ...resData?.home?.discount_title,
              [language]: data.discount_title || "",
            }),

            promotion_title: handleRemoveEmptyKey({
              ...resData?.home?.promotion_title,
              [language]: data.promotion_title || "",
            }),
            promotion_description: handleRemoveEmptyKey({
              ...resData?.home?.promotion_description,
              [language]: data.promotion_description || "",
            }),
            promotion_button_name: handleRemoveEmptyKey({
              ...resData?.home?.promotion_button_name,
              [language]: data.promotion_button_name || "",
            }),
            promotion_button_link: data.promotion_button_link,

            feature_title: handleRemoveEmptyKey({
              ...resData?.home?.feature_title,
              [language]: data.feature_title || "",
            }),
            feature_description: handleRemoveEmptyKey({
              ...resData?.home?.feature_description,
              [language]: data.feature_description || "",
            }),
            feature_product_limit: data.feature_product_limit,

            popular_title: handleRemoveEmptyKey({
              ...resData?.home?.popular_title,
              [language]: data.popular_title || "",
            }),
            popular_description: handleRemoveEmptyKey({
              ...resData?.home?.popular_description,
              [language]: data.popular_description || "",
            }),
            popular_product_limit: data.popular_product_limit,

            quick_delivery_subtitle: handleRemoveEmptyKey({
              ...resData?.home?.quick_delivery_subtitle,
              [language]: data.quick_delivery_subtitle || "",
            }),
            quick_delivery_title: handleRemoveEmptyKey({
              ...resData?.home?.quick_delivery_title,
              [language]: data.quick_delivery_title || "",
            }),
            quick_delivery_description: handleRemoveEmptyKey({
              ...resData?.home?.quick_delivery_description,
              [language]: data.quick_delivery_description || "",
            }),
            quick_delivery_button: handleRemoveEmptyKey({
              ...resData?.home?.quick_delivery_button,
              [language]: data.quick_delivery_button || "",
            }),

            latest_discount_title: handleRemoveEmptyKey({
              ...resData?.home?.latest_discount_title,
              [language]: data.latest_discount_title || "",
            }),
            latest_discount_description: handleRemoveEmptyKey({
              ...resData?.home?.latest_discount_description,
              [language]: data.latest_discount_description || "",
            }),
            latest_discount_product_limit: data.latest_discount_product_limit,

            daily_need_title: handleRemoveEmptyKey({
              ...resData?.home?.daily_need_title,
              [language]: data.daily_need_title || "",
            }),
            daily_need_description: handleRemoveEmptyKey({
              ...resData?.home?.daily_need_description,
              [language]: data.daily_need_description || "",
            }),
            daily_need_app_link: data.daily_need_app_link,
            daily_need_google_link: data.daily_need_google_link,
            daily_need_img_left: getYourDailyNeedImageLeft,
            daily_need_img_right: getYourDailyNeedImageRight,
            button1_img: getButton1image,
            button2_img: getButton2image,
          },
          about_us: {
            header_status: aboutPageHeader,
            content_left_status: aboutTopContentLeft,
            content_right_status: aboutTopContentRight,
            top_section_image: aboutTopContentRightImage,
            content_middle_status: aboutMiddleContentSection,
            founder_status: ourFounderSection,
            header_bg: aboutHeaderBg,
            content_middle_Img: aboutMiddleContentImage,
            founder_one_img: ourFounderOneImage,
            founder_two_img: ourFounderTwoImage,
            founder_three_img: ourFounderThreeImage,
            founder_four_img: ourFounderFourImage,
            founder_five_img: ourFounderFiveImage,
            founder_six_img: ourFounderSixImage,
            founder_seven_img: ourFounderSevenImage,
            founder_eight_img: ourFounderEightImage,
            founder_nine_img: ourFounderNineImage,
            founder_ten_img: ourFounderTenImage,
            founder_eleven_img: ourFounderElevenImage,
            founder_twelve_img: ourFounderTwelveImage,
            title: handleRemoveEmptyKey({
              ...resData?.about_us?.title,
              en: data.about_page_title_en || "",
              ar: data.about_page_title_ar || "",
            }),

            hero_description: handleRemoveEmptyKey({
              ...resData?.about_us?.hero_description,
              en: data.about_page_hero_description_en || "",
              ar: data.about_page_hero_description_ar || "",
            }),

            top_section_title: handleRemoveEmptyKey({
              ...resData?.about_us?.top_section_title,
              en: data.about_page_top_section_title_en || "",
              ar: data.about_page_top_section_title_ar || "",
            }),

            top_section_description: handleRemoveEmptyKey({
              ...resData?.about_us?.top_section_description,
              en: data.about_page_top_section_description_en || "",
              ar: data.about_page_top_section_description_ar || "",
            }),

            top_section_image: aboutTopContentRightImage,

            top_title: handleRemoveEmptyKey({
              ...resData?.about_us?.top_title,
              [language]: data.about_page_top_section_title || "",
            }),

            top_description: handleRemoveEmptyKey({
              ...resData?.about_us?.top_description,
              [language]: data.about_page_top_section_description || "",
            }),

            card_one_title: handleRemoveEmptyKey({
              ...resData?.about_us?.card_one_title,
              en: data.about_page_card_one_title_en || "",
              ar: data.about_page_card_one_title_ar || "",
            }),

            card_one_sub: handleRemoveEmptyKey({
              ...resData?.about_us?.card_one_sub,
              en: data.about_page_card_one_subtitle_en || "",
              ar: data.about_page_card_one_subtitle_ar || "",
            }),

            card_one_description: handleRemoveEmptyKey({
              ...resData?.about_us?.card_one_description,
              en: data.about_page_card_one_description_en || "",
              ar: data.about_page_card_one_description_ar || "",
            }),
            card_two_title: handleRemoveEmptyKey({
              ...resData?.about_us?.card_two_title,
              en: data.about_page_card_two_title_en || "",
              ar: data.about_page_card_two_title_ar || "",
            }),
            card_two_sub: handleRemoveEmptyKey({
              ...resData?.about_us?.card_two_sub,
              en: data.about_page_card_two_subtitle_en || "",
              ar: data.about_page_card_two_subtitle_ar || "",
            }),
            card_two_description: handleRemoveEmptyKey({
              ...resData?.about_us?.card_two_description,
              en: data.about_page_card_two_description_en || "",
              ar: data.about_page_card_two_description_ar || "",
            }),
            middle_description_one: handleRemoveEmptyKey({
              ...resData?.about_us?.middle_description_one,
              [language]: data.about_us_middle_description_one || "",
            }),
            middle_description_two: handleRemoveEmptyKey({
              ...resData?.about_us?.middle_description_two,
              [language]: data.about_us_middle_description_two || "",
            }),
            founder_title: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_title,
              [language]: data.about_page_ourfounder_title || "",
            }),
            founder_description: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_description,
              [language]: data.about_us_ourfounder_description || "",
            }),
            founder_one_name: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_one_name,
              en: data.about_page_founder_one_name_en || "",
              ar: data.about_page_founder_one_name_ar || "",
            }),
            founder_one_position: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_one_position,
              en: data.about_page_founder_one_position_en || "",
              ar: data.about_page_founder_one_position_ar || "",
            }),
            founder_two_name: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_two_name,
              en: data.about_page_founder_two_name_en || "",
              ar: data.about_page_founder_two_name_ar || "",
            }),
            founder_two_position: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_two_position,
              en: data.about_page_founder_two_position_en || "",
              ar: data.about_page_founder_two_position_ar || "",
            }),
            founder_three_name: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_three_name,
              en: data.about_page_founder_three_name_en || "",
              ar: data.about_page_founder_three_name_ar || "",
            }),
            founder_three_position: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_three_position,
              en: data.about_page_founder_three_position_en || "",
              ar: data.about_page_founder_three_position_ar || "",
            }),
            founder_four_name: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_four_name,
              en: data.about_page_founder_four_name_en || "",
              ar: data.about_page_founder_four_name_ar || "",
            }),
            founder_four_position: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_four_position,
              en: data.about_page_founder_four_position_en || "",
              ar: data.about_page_founder_four_position_ar || "",
            }),
            founder_five_name: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_five_name,
              en: data.about_page_founder_five_name_en || "",
              ar: data.about_page_founder_five_name_ar || "",
            }),
            founder_five_position: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_five_position,
              en: data.about_page_founder_five_position_en || "",
              ar: data.about_page_founder_five_position_ar || "",
            }),
            founder_six_name: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_six_name,
              en: data.about_page_founder_six_name_en || "",
              ar: data.about_page_founder_six_name_ar || "",
            }),
            founder_six_position: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_six_position,
              en: data.about_page_founder_six_position_en || "",
              ar: data.about_page_founder_six_position_ar || "",
            }),
            // Core Values Section
            values_title: handleRemoveEmptyKey({
              ...resData?.about_us?.values_title,
              en: data.about_page_values_title_en || "",
              ar: data.about_page_values_title_ar || "",
            }),
            values_description: handleRemoveEmptyKey({
              ...resData?.about_us?.values_description,
              en: data.about_page_values_description_en || "",
              ar: data.about_page_values_description_ar || "",
            }),
            value_one_title: handleRemoveEmptyKey({
              ...resData?.about_us?.value_one_title,
              en: data.about_page_value_one_title_en || "",
              ar: data.about_page_value_one_title_ar || "",
            }),
            value_one_description: handleRemoveEmptyKey({
              ...resData?.about_us?.value_one_description,
              en: data.about_page_value_one_description_en || "",
              ar: data.about_page_value_one_description_ar || "",
            }),
            value_two_title: handleRemoveEmptyKey({
              ...resData?.about_us?.value_two_title,
              en: data.about_page_value_two_title_en || "",
              ar: data.about_page_value_two_title_ar || "",
            }),
            value_two_description: handleRemoveEmptyKey({
              ...resData?.about_us?.value_two_description,
              en: data.about_page_value_two_description_en || "",
              ar: data.about_page_value_two_description_ar || "",
            }),
            value_three_title: handleRemoveEmptyKey({
              ...resData?.about_us?.value_three_title,
              en: data.about_page_value_three_title_en || "",
              ar: data.about_page_value_three_title_ar || "",
            }),
            value_three_description: handleRemoveEmptyKey({
              ...resData?.about_us?.value_three_description,
              en: data.about_page_value_three_description_en || "",
              ar: data.about_page_value_three_description_ar || "",
            }),
            value_four_title: handleRemoveEmptyKey({
              ...resData?.about_us?.value_four_title,
              en: data.about_page_value_four_title_en || "",
              ar: data.about_page_value_four_title_ar || "",
            }),
            value_four_description: handleRemoveEmptyKey({
              ...resData?.about_us?.value_four_description,
              en: data.about_page_value_four_description_en || "",
              ar: data.about_page_value_four_description_ar || "",
            }),
            // Growing Stronger Communities Section
            community_title: handleRemoveEmptyKey({
              ...resData?.about_us?.community_title,
              [language]: data.about_page_community_title || "",
            }),
            community_description_one: handleRemoveEmptyKey({
              ...resData?.about_us?.community_description_one,
              [language]: data.about_page_community_description_one || "",
            }),
            community_description_two: handleRemoveEmptyKey({
              ...resData?.about_us?.community_description_two,
              [language]: data.about_page_community_description_two || "",
            }),
            community_stat_one_number: handleRemoveEmptyKey({
              ...resData?.about_us?.community_stat_one_number,
              [language]: data.about_page_community_stat_one_number || "",
            }),
            community_stat_one_label: handleRemoveEmptyKey({
              ...resData?.about_us?.community_stat_one_label,
              [language]: data.about_page_community_stat_one_label || "",
            }),
            community_stat_two_number: handleRemoveEmptyKey({
              ...resData?.about_us?.community_stat_two_number,
              [language]: data.about_page_community_stat_two_number || "",
            }),
            community_stat_two_label: handleRemoveEmptyKey({
              ...resData?.about_us?.community_stat_two_label,
              [language]: data.about_page_community_stat_two_label || "",
            }),
            community_cta_title: handleRemoveEmptyKey({
              ...resData?.about_us?.community_cta_title,
              [language]: data.about_page_community_cta_title || "",
            }),
            community_cta_description: handleRemoveEmptyKey({
              ...resData?.about_us?.community_cta_description,
              [language]: data.about_page_community_cta_description || "",
            }),
            // Heritage Section
            heritage_title: handleRemoveEmptyKey({
              ...resData?.about_us?.heritage_title,
              en: data.about_page_heritage_title_en || "",
              ar: data.about_page_heritage_title_ar || "",
            }),

            heritage_description_one: handleRemoveEmptyKey({
              ...resData?.about_us?.heritage_description_one,
              en: data.about_page_heritage_description_one_en || "",
              ar: data.about_page_heritage_description_one_ar || "",
            }),

            heritage_description_two: handleRemoveEmptyKey({
              ...resData?.about_us?.heritage_description_two,
              en: data.about_page_heritage_description_two_en || "",
              ar: data.about_page_heritage_description_two_ar || "",
            }),

            heritage_image: aboutMiddleContentImage,

            // Team Section
            team_title: handleRemoveEmptyKey({
              ...resData?.about_us?.team_title,
              en: data.about_page_team_title_en || "",
              ar: data.about_page_team_title_ar || "",
            }),

            team_description: handleRemoveEmptyKey({
              ...resData?.about_us?.team_description,
              en: data.about_page_team_description_en || "",
              ar: data.about_page_team_description_ar || "",
            }),

            leadership_title: handleRemoveEmptyKey({
              ...resData?.about_us?.leadership_title,
              en: data.about_page_leadership_title_en || "",
              ar: data.about_page_leadership_title_ar || "",
            }),

            leadership_subtitle: handleRemoveEmptyKey({
              ...resData?.about_us?.leadership_subtitle,
              en: data.about_page_leadership_subtitle_en || "",
              ar: data.about_page_leadership_subtitle_ar || "",
            }),

            // Core Values - Already mapped above with bilingual support





            // Team Members (12 members)
            founder_one_name: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_one_name,
              en: data.about_page_founder_one_name_en || "",
              ar: data.about_page_founder_one_name_ar || "",
            }),

            founder_one_position: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_one_position,
              en: data.about_page_founder_one_position_en || "",
              ar: data.about_page_founder_one_position_ar || "",
            }),

            // Note: founder_two, founder_three, founder_four are already mapped above with bilingual support
            // Removing duplicate mappings that were overwriting the bilingual data

            founder_five_name: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_five_name,
              en: data.about_page_founder_five_name_en || "",
              ar: data.about_page_founder_five_name_ar || "",
            }),

            founder_five_position: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_five_position,
              en: data.about_page_founder_five_position_en || "",
              ar: data.about_page_founder_five_position_ar || "",
            }),

            founder_six_name: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_six_name,
              en: data.about_page_founder_six_name_en || "",
              ar: data.about_page_founder_six_name_ar || "",
            }),

            founder_six_position: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_six_position,
              en: data.about_page_founder_six_position_en || "",
              ar: data.about_page_founder_six_position_ar || "",
            }),

            founder_seven_name: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_seven_name,
              en: data.about_page_founder_seven_name_en || "",
              ar: data.about_page_founder_seven_name_ar || "",
            }),
            founder_seven_position: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_seven_position,
              en: data.about_page_founder_seven_position_en || "",
              ar: data.about_page_founder_seven_position_ar || "",
            }),

            founder_eight_name: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_eight_name,
              en: data.about_page_founder_eight_name_en || "",
              ar: data.about_page_founder_eight_name_ar || "",
            }),
            founder_eight_position: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_eight_position,
              en: data.about_page_founder_eight_position_en || "",
              ar: data.about_page_founder_eight_position_ar || "",
            }),

            founder_nine_name: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_nine_name,
              en: data.about_page_founder_nine_name_en || "",
              ar: data.about_page_founder_nine_name_ar || "",
            }),
            founder_nine_position: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_nine_position,
              en: data.about_page_founder_nine_position_en || "",
              ar: data.about_page_founder_nine_position_ar || "",
            }),

            founder_ten_name: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_ten_name,
              en: data.about_page_founder_ten_name_en || "",
              ar: data.about_page_founder_ten_name_ar || "",
            }),
            founder_ten_position: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_ten_position,
              en: data.about_page_founder_ten_position_en || "",
              ar: data.about_page_founder_ten_position_ar || "",
            }),

            founder_eleven_name: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_eleven_name,
              en: data.about_page_founder_eleven_name_en || "",
              ar: data.about_page_founder_eleven_name_ar || "",
            }),
            founder_eleven_position: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_eleven_position,
              en: data.about_page_founder_eleven_position_en || "",
              ar: data.about_page_founder_eleven_position_ar || "",
            }),

            founder_twelve_name: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_twelve_name,
              en: data.about_page_founder_twelve_name_en || "",
              ar: data.about_page_founder_twelve_name_ar || "",
            }),
            founder_twelve_position: handleRemoveEmptyKey({
              ...resData?.about_us?.founder_twelve_position,
              en: data.about_page_founder_twelve_position_en || "",
              ar: data.about_page_founder_twelve_position_ar || "",
            }),

            // Branches - Bilingual
            branches_title: handleRemoveEmptyKey({
              ...resData?.about_us?.branches_title,
              en: data.about_page_branches_title_en || "",
              ar: data.about_page_branches_title_ar || "",
            }),

            branches_description: handleRemoveEmptyKey({
              ...resData?.about_us?.branches_description,
              en: data.about_page_branches_description_en || "",
              ar: data.about_page_branches_description_ar || "",
            }),
            branches_cta_title: handleRemoveEmptyKey({
              ...resData?.about_us?.branches_cta_title,
              en: data.about_page_branches_cta_title_en || "",
              ar: data.about_page_branches_cta_title_ar || "",
            }),
            branches_cta_description: handleRemoveEmptyKey({
              ...resData?.about_us?.branches_cta_description,
              en: data.about_page_branches_cta_description_en || "",
              ar: data.about_page_branches_cta_description_ar || "",
            }),

            // Individual Branch Data - Bilingual
            branch_one_name: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_one_name,
              en: data.about_page_branch_one_name_en || "",
              ar: data.about_page_branch_one_name_ar || "",
            }),
            branch_one_address: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_one_address,
              en: data.about_page_branch_one_address_en || "",
              ar: data.about_page_branch_one_address_ar || "",
            }),
            branch_one_phone: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_one_phone,
              en: data.about_page_branch_one_phone_en || "",
              ar: data.about_page_branch_one_phone_ar || "",
            }),
            branch_one_hours: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_one_hours,
              en: data.about_page_branch_one_hours_en || "",
              ar: data.about_page_branch_one_hours_ar || "",
            }),
            branch_one_subtitle: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_one_subtitle,
              en: data.about_page_branch_one_subtitle_en || "",
              ar: data.about_page_branch_one_subtitle_ar || "",
            }),
            branch_one_services: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_one_services,
              en: data.about_page_branch_one_services_en || "",
              ar: data.about_page_branch_one_services_ar || "",
            }),
            branch_one_directions: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_one_directions,
              en: data.about_page_branch_one_directions_en || "",
              ar: data.about_page_branch_one_directions_ar || "",
            }),

            branch_two_name: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_two_name,
              en: data.about_page_branch_two_name_en || "",
              ar: data.about_page_branch_two_name_ar || "",
            }),
            branch_two_address: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_two_address,
              en: data.about_page_branch_two_address_en || "",
              ar: data.about_page_branch_two_address_ar || "",
            }),
            branch_two_phone: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_two_phone,
              en: data.about_page_branch_two_phone_en || "",
              ar: data.about_page_branch_two_phone_ar || "",
            }),
            branch_two_hours: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_two_hours,
              en: data.about_page_branch_two_hours_en || "",
              ar: data.about_page_branch_two_hours_ar || "",
            }),
            branch_two_subtitle: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_two_subtitle,
              en: data.about_page_branch_two_subtitle_en || "",
              ar: data.about_page_branch_two_subtitle_ar || "",
            }),
            branch_two_services: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_two_services,
              en: data.about_page_branch_two_services_en || "",
              ar: data.about_page_branch_two_services_ar || "",
            }),
            branch_two_directions: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_two_directions,
              en: data.about_page_branch_two_directions_en || "",
              ar: data.about_page_branch_two_directions_ar || "",
            }),

            branch_three_name: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_three_name,
              en: data.about_page_branch_three_name_en || "",
              ar: data.about_page_branch_three_name_ar || "",
            }),
            branch_three_address: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_three_address,
              en: data.about_page_branch_three_address_en || "",
              ar: data.about_page_branch_three_address_ar || "",
            }),
            branch_three_phone: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_three_phone,
              en: data.about_page_branch_three_phone_en || "",
              ar: data.about_page_branch_three_phone_ar || "",
            }),
            branch_three_hours: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_three_hours,
              en: data.about_page_branch_three_hours_en || "",
              ar: data.about_page_branch_three_hours_ar || "",
            }),
            branch_three_subtitle: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_three_subtitle,
              en: data.about_page_branch_three_subtitle_en || "",
              ar: data.about_page_branch_three_subtitle_ar || "",
            }),
            branch_three_services: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_three_services,
              en: data.about_page_branch_three_services_en || "",
              ar: data.about_page_branch_three_services_ar || "",
            }),
            branch_three_directions: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_three_directions,
              en: data.about_page_branch_three_directions_en || "",
              ar: data.about_page_branch_three_directions_ar || "",
            }),

            branch_four_name: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_four_name,
              en: data.about_page_branch_four_name_en || "",
              ar: data.about_page_branch_four_name_ar || "",
            }),
            branch_four_address: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_four_address,
              en: data.about_page_branch_four_address_en || "",
              ar: data.about_page_branch_four_address_ar || "",
            }),
            branch_four_phone: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_four_phone,
              en: data.about_page_branch_four_phone_en || "",
              ar: data.about_page_branch_four_phone_ar || "",
            }),
            branch_four_hours: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_four_hours,
              en: data.about_page_branch_four_hours_en || "",
              ar: data.about_page_branch_four_hours_ar || "",
            }),
            branch_four_subtitle: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_four_subtitle,
              en: data.about_page_branch_four_subtitle_en || "",
              ar: data.about_page_branch_four_subtitle_ar || "",
            }),
            branch_four_services: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_four_services,
              en: data.about_page_branch_four_services_en || "",
              ar: data.about_page_branch_four_services_ar || "",
            }),
            branch_four_directions: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_four_directions,
              en: data.about_page_branch_four_directions_en || "",
              ar: data.about_page_branch_four_directions_ar || "",
            }),

            branch_five_name: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_five_name,
              en: data.about_page_branch_five_name_en || "",
              ar: data.about_page_branch_five_name_ar || "",
            }),
            branch_five_address: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_five_address,
              en: data.about_page_branch_five_address_en || "",
              ar: data.about_page_branch_five_address_ar || "",
            }),
            branch_five_phone: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_five_phone,
              en: data.about_page_branch_five_phone_en || "",
              ar: data.about_page_branch_five_phone_ar || "",
            }),
            branch_five_hours: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_five_hours,
              en: data.about_page_branch_five_hours_en || "",
              ar: data.about_page_branch_five_hours_ar || "",
            }),
            branch_five_subtitle: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_five_subtitle,
              en: data.about_page_branch_five_subtitle_en || "",
              ar: data.about_page_branch_five_subtitle_ar || "",
            }),
            branch_five_services: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_five_services,
              en: data.about_page_branch_five_services_en || "",
              ar: data.about_page_branch_five_services_ar || "",
            }),
            branch_five_directions: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_five_directions,
              en: data.about_page_branch_five_directions_en || "",
              ar: data.about_page_branch_five_directions_ar || "",
            }),

            branch_six_name: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_six_name,
              en: data.about_page_branch_six_name_en || "",
              ar: data.about_page_branch_six_name_ar || "",
            }),
            branch_six_address: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_six_address,
              en: data.about_page_branch_six_address_en || "",
              ar: data.about_page_branch_six_address_ar || "",
            }),
            branch_six_phone: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_six_phone,
              en: data.about_page_branch_six_phone_en || "",
              ar: data.about_page_branch_six_phone_ar || "",
            }),
            branch_six_hours: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_six_hours,
              en: data.about_page_branch_six_hours_en || "",
              ar: data.about_page_branch_six_hours_ar || "",
            }),
            branch_six_subtitle: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_six_subtitle,
              en: data.about_page_branch_six_subtitle_en || "",
              ar: data.about_page_branch_six_subtitle_ar || "",
            }),
            branch_six_services: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_six_services,
              en: data.about_page_branch_six_services_en || "",
              ar: data.about_page_branch_six_services_ar || "",
            }),
            branch_six_directions: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_six_directions,
              en: data.about_page_branch_six_directions_en || "",
              ar: data.about_page_branch_six_directions_ar || "",
            }),

            branch_seven_name: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_seven_name,
              en: data.about_page_branch_seven_name_en || "",
              ar: data.about_page_branch_seven_name_ar || "",
            }),
            branch_seven_address: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_seven_address,
              en: data.about_page_branch_seven_address_en || "",
              ar: data.about_page_branch_seven_address_ar || "",
            }),
            branch_seven_phone: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_seven_phone,
              en: data.about_page_branch_seven_phone_en || "",
              ar: data.about_page_branch_seven_phone_ar || "",
            }),
            branch_seven_hours: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_seven_hours,
              en: data.about_page_branch_seven_hours_en || "",
              ar: data.about_page_branch_seven_hours_ar || "",
            }),
            branch_seven_subtitle: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_seven_subtitle,
              en: data.about_page_branch_seven_subtitle_en || "",
              ar: data.about_page_branch_seven_subtitle_ar || "",
            }),
            branch_seven_services: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_seven_services,
              en: data.about_page_branch_seven_services_en || "",
              ar: data.about_page_branch_seven_services_ar || "",
            }),
            branch_seven_directions: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_seven_directions,
              en: data.about_page_branch_seven_directions_en || "",
              ar: data.about_page_branch_seven_directions_ar || "",
            }),

            branch_eight_name: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_eight_name,
              en: data.about_page_branch_eight_name_en || "",
              ar: data.about_page_branch_eight_name_ar || "",
            }),
            branch_eight_address: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_eight_address,
              en: data.about_page_branch_eight_address_en || "",
              ar: data.about_page_branch_eight_address_ar || "",
            }),
            branch_eight_phone: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_eight_phone,
              en: data.about_page_branch_eight_phone_en || "",
              ar: data.about_page_branch_eight_phone_ar || "",
            }),
            branch_eight_hours: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_eight_hours,
              en: data.about_page_branch_eight_hours_en || "",
              ar: data.about_page_branch_eight_hours_ar || "",
            }),
            branch_eight_subtitle: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_eight_subtitle,
              en: data.about_page_branch_eight_subtitle_en || "",
              ar: data.about_page_branch_eight_subtitle_ar || "",
            }),
            branch_eight_services: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_eight_services,
              en: data.about_page_branch_eight_services_en || "",
              ar: data.about_page_branch_eight_services_ar || "",
            }),
            branch_eight_directions: handleRemoveEmptyKey({
              ...resData?.about_us?.branch_eight_directions,
              en: data.about_page_branch_eight_directions_en || "",
              ar: data.about_page_branch_eight_directions_ar || "",
            }),

            // Upcoming Branches - Bilingual
            upcoming_branches_title: handleRemoveEmptyKey({
              ...resData?.about_us?.upcoming_branches_title,
              en: data.about_page_upcoming_branches_title_en || "",
              ar: data.about_page_upcoming_branches_title_ar || "",
            }),

            upcoming_branch_one_name: handleRemoveEmptyKey({
              ...resData?.about_us?.upcoming_branch_one_name,
              en: data.about_page_upcoming_branch_one_name_en || "",
              ar: data.about_page_upcoming_branch_one_name_ar || "",
            }),
            upcoming_branch_one_address: handleRemoveEmptyKey({
              ...resData?.about_us?.upcoming_branch_one_address,
              en: data.about_page_upcoming_branch_one_address_en || "",
              ar: data.about_page_upcoming_branch_one_address_ar || "",
            }),

            upcoming_branch_two_name: handleRemoveEmptyKey({
              ...resData?.about_us?.upcoming_branch_two_name,
              en: data.about_page_upcoming_branch_two_name_en || "",
              ar: data.about_page_upcoming_branch_two_name_ar || "",
            }),
            upcoming_branch_two_address: handleRemoveEmptyKey({
              ...resData?.about_us?.upcoming_branch_two_address,
              en: data.about_page_upcoming_branch_two_address_en || "",
              ar: data.about_page_upcoming_branch_two_address_ar || "",
            }),

            upcoming_branch_one_quarter: handleRemoveEmptyKey({
              ...resData?.about_us?.upcoming_branch_one_quarter,
              en: data.about_page_upcoming_branch_one_quarter_en || "",
              ar: data.about_page_upcoming_branch_one_quarter_ar || "",
            }),
            upcoming_branch_one_features: handleRemoveEmptyKey({
              ...resData?.about_us?.upcoming_branch_one_features,
              en: data.about_page_upcoming_branch_one_features_en || "",
              ar: data.about_page_upcoming_branch_one_features_ar || "",
            }),
            upcoming_branch_one_emoji: handleRemoveEmptyKey({
              ...resData?.about_us?.upcoming_branch_one_emoji,
              en: data.about_page_upcoming_branch_one_emoji_en || "",
              ar: data.about_page_upcoming_branch_one_emoji_ar || "",
            }),

            upcoming_branch_two_quarter: handleRemoveEmptyKey({
              ...resData?.about_us?.upcoming_branch_two_quarter,
              en: data.about_page_upcoming_branch_two_quarter_en || "",
              ar: data.about_page_upcoming_branch_two_quarter_ar || "",
            }),
            upcoming_branch_two_features: handleRemoveEmptyKey({
              ...resData?.about_us?.upcoming_branch_two_features,
              en: data.about_page_upcoming_branch_two_features_en || "",
              ar: data.about_page_upcoming_branch_two_features_ar || "",
            }),
            upcoming_branch_two_emoji: handleRemoveEmptyKey({
              ...resData?.about_us?.upcoming_branch_two_emoji,
              en: data.about_page_upcoming_branch_two_emoji_en || "",
              ar: data.about_page_upcoming_branch_two_emoji_ar || "",
            }),
            trusted_badge_one_pill: handleRemoveEmptyKey({
              ...resData?.about_us?.trusted_badge_one_pill,
              en: data.about_page_trusted_badge_one_pill_en || "",
              ar: data.about_page_trusted_badge_one_pill_ar || "",
            }),
            trusted_badge_one_text: handleRemoveEmptyKey({
              ...resData?.about_us?.trusted_badge_one_text,
              en: data.about_page_trusted_badge_one_text_en || "",
              ar: data.about_page_trusted_badge_one_text_ar || "",
            }),
            trusted_badge_two_pill: handleRemoveEmptyKey({
              ...resData?.about_us?.trusted_badge_two_pill,
              en: data.about_page_trusted_badge_two_pill_en || "",
              ar: data.about_page_trusted_badge_two_pill_ar || "",
            }),
            trusted_badge_two_text: handleRemoveEmptyKey({
              ...resData?.about_us?.trusted_badge_two_text,
              en: data.about_page_trusted_badge_two_text_en || "",
              ar: data.about_page_trusted_badge_two_text_ar || "",
            }),
          },
          contact_us: {
            header_status: contactPageHeader,
            email_box_status: emailUsBox,
            call_box_status: callUsBox,
            address_box_status: addressBox,
            left_col_status: contactMidLeftColStatus,
            form_status: contactFormStatus,
            header_bg: contactHeaderBg,
            left_col_img: contactMidLeftColImage,
            title: handleRemoveEmptyKey({
              ...resData?.contact_us?.title,
              en: data.contact_page_title || "",
              ar: data.contact_page_title_ar || "",
            }),

            email_box_title: handleRemoveEmptyKey({
              ...resData?.contact_us?.email_box_title,
              en: data.contact_page_email_box_title || "",
              ar: data.contact_page_email_box_title_ar || "",
            }),
            email_box_email: handleRemoveEmptyKey({
              ...resData?.contact_us?.email_box_email,
              en: data.contact_page_email_box_email || "",
              ar: data.contact_page_email_box_email_ar || "",
            }),
            email_box_text: handleRemoveEmptyKey({
              ...resData?.contact_us?.email_box_text,
              en: data.contact_page_email_box_text || "",
              ar: data.contact_page_email_box_text_ar || "",
            }),

            call_box_title: handleRemoveEmptyKey({
              ...resData?.contact_us?.call_box_title,
              en: data.contact_page_callUs_box_title || "",
              ar: data.contact_page_callUs_box_title_ar || "",
            }),
            call_box_phone: handleRemoveEmptyKey({
              ...resData?.contact_us?.call_box_phone,
              en: data.contact_page_callUs_box_phone || "",
              ar: data.contact_page_callUs_box_phone_ar || "",
            }),
            call_box_text: handleRemoveEmptyKey({
              ...resData?.contact_us?.call_box_text,
              en: data.contact_page_callUs_box_text || "",
              ar: data.contact_page_callUs_box_text_ar || "",
            }),

            address_box_title: handleRemoveEmptyKey({
              ...resData?.contact_us?.address_box_title,
              en: data.contact_page_address_box_title || "",
              ar: data.contact_page_address_box_title_ar || "",
            }),
            address_box_address_one: handleRemoveEmptyKey({
              ...resData?.contact_us?.address_box_address_one,
              en: data.contact_page_address_box_address_one || "",
              ar: data.contact_page_address_box_address_one_ar || "",
            }),
            address_box_address_two: handleRemoveEmptyKey({
              ...resData?.contact_us?.address_box_address_two,
              en: data.contact_page_address_box_address_two || "",
              ar: data.contact_page_address_box_address_two_ar || "",
            }),
            address_box_address_three: handleRemoveEmptyKey({
              ...resData?.contact_us?.address_box_address_three,
              en: data.contact_page_address_box_address_three || "",
              ar: data.contact_page_address_box_address_three_ar || "",
            }),
            form_title: handleRemoveEmptyKey({
              ...resData?.contact_us?.form_title,
              en: data.contact_page_form_title || "",
              ar: data.contact_page_form_title_ar || "",
            }),
            form_description: handleRemoveEmptyKey({
              ...resData?.contact_us?.form_description,
              en: data.contact_page_form_description || "",
              ar: data.contact_page_form_description_ar || "",
            }),
          },
          offers: {
            header_status: offersPageHeader,
            header_bg: offersHeaderBg,
            title: handleRemoveEmptyKey({
              ...resData?.offers?.title,
              [language]: data.offers_page_title || "",
            }),
            coupon_code: couponList1?.map((coupon) => coupon?.value),
          },
          privacy_policy: {
            status: privacyPolicy,
            header_bg: privacyPolicyHeaderBg,

            effective_date: data.pp_effective_date,
            last_updated: data.pp_last_updated,
            tagline: handleRemoveEmptyKey({
              ...resData?.privacy_policy?.tagline,
              [language]: data.pp_tagline || "",
            }),

            rights_title: handleRemoveEmptyKey({
              ...resData?.privacy_policy?.rights_title,
              [language]: data.rights_title || "",
            }),
            rights_desc: handleRemoveEmptyKey({
              ...resData?.privacy_policy?.rights_desc,
              [language]: data.rights_desc || "",
            }),

            title: handleRemoveEmptyKey({
              ...resData?.privacy_policy?.title,
              [language]: data.privacy_page_title || "",
            }),

            description: handleRemoveEmptyKey({
              ...resData?.privacy_policy?.description,
              [language]: textEdit
                ? draftToHtml(convertToRaw(textEdit.getCurrentContent()))
                : "",
            }),

            // CTA fields
            cta_title: handleRemoveEmptyKey({
              ...resData?.privacy_policy?.cta_title,
              [language]: data.pp_cta_title || "",
            }),
            cta_desc: handleRemoveEmptyKey({
              ...resData?.privacy_policy?.cta_desc,
              [language]: data.pp_cta_desc || "",
            }),
            cta_btn_text: handleRemoveEmptyKey({
              ...resData?.privacy_policy?.cta_btn_text,
              [language]: data.pp_cta_btn_text || "",
            }),
            cta_btn_link: data.pp_cta_btn_link,

            // dynamic sections 1-12
            ...( (() => {
              const words = [
                "one","two","three","four","five","six","seven","eight",
                "nine","ten","eleven","twelve"
              ];
              return words.reduce((acc,w,idx)=>{
                acc[`section_${w}_title`] = handleRemoveEmptyKey({
                  ...resData?.privacy_policy?.[`section_${w}_title`],
                  [language]: data[`pp_section_${idx+1}_title`] || "",
                });
                acc[`section_${w}_body`] = handleRemoveEmptyKey({
                  ...resData?.privacy_policy?.[`section_${w}_body`],
                  [language]: data[`pp_section_${idx+1}_body`] || "",
                });
                return acc;
              }, {});
            })() ),

            // rights boxes 1-6
            ...( (() => {
              return Array.from({length:6}).reduce((acc,_,idx)=>{
                const n = idx+1;
                acc[`right_${n}_name`] = handleRemoveEmptyKey({
                  ...resData?.privacy_policy?.[`right_${n}_name`],
                  [language]: data[`pp_right_${n}_name`] || "",
                });
                acc[`right_${n}_desc`] = handleRemoveEmptyKey({
                  ...resData?.privacy_policy?.[`right_${n}_desc`],
                  [language]: data[`pp_right_${n}_desc`] || "",
                });
                acc[`right_${n}_emoji`] = data[`pp_right_${n}_emoji`] || "";
                return acc;
              }, {});
            })() ),
          },
          term_and_condition: {
            status: termsConditions,
            header_bg: termsConditionsHeaderBg,

            effective_date: data.tc_effective_date,
            last_updated: data.tc_last_updated,

            title: handleRemoveEmptyKey({
              ...resData?.term_and_condition?.title,
              [language]: data.termsConditions_page_title || "",
            }),

            description: {
              ...resData?.term_and_condition?.description,
              [language]: termsConditionsTextEdit
                ? draftToHtml(
                    convertToRaw(termsConditionsTextEdit.getCurrentContent())
                  )
                : "",
            },

            // CTA fields
            cta_title: handleRemoveEmptyKey({
              ...resData?.term_and_condition?.cta_title,
              [language]: data.tc_cta_title || "",
            }),
            cta_desc: handleRemoveEmptyKey({
              ...resData?.term_and_condition?.cta_desc,
              [language]: data.tc_cta_desc || "",
            }),
            cta_btn_text: handleRemoveEmptyKey({
              ...resData?.term_and_condition?.cta_btn_text,
              [language]: data.tc_cta_btn_text || "",
            }),
            cta_btn_link: data.tc_cta_btn_link,

            // dynamic sections
            ...( (() => {
              const words = [
                "one","two","three","four","five","six","seven","eight",
                "nine","ten","eleven","twelve","thirteen","fourteen","fifteen"
              ];
              return words.reduce((acc,w,idx)=>{
                acc[`section_${w}_title`] = handleRemoveEmptyKey({
                  ...resData?.term_and_condition?.[`section_${w}_title`],
                  [language]: data[`tc_section_${idx+1}_title`] || "",
                });
                acc[`section_${w}_body`] = handleRemoveEmptyKey({
                  ...resData?.term_and_condition?.[`section_${w}_body`],
                  [language]: data[`tc_section_${idx+1}_body`] || "",
                });
                return acc;
              }, {});
            })() ),
          },
          faq: {
            page_status: faqStatus,
            header_bg: faqHeaderBg,
            leftcol_status: faqLeftColStatus,
            rightcol_status: faqRightColStatus,
            left_img: faqLeftColImage,

            title: handleRemoveEmptyKey({
              ...resData?.faq?.title,
              [language]: data.faq_page_title || "",
            }),
            faq_one: handleRemoveEmptyKey({
              ...resData?.faq?.faq_one,
              [language]: data.faq_title_one || "",
            }),
            description_one: handleRemoveEmptyKey({
              ...resData?.faq?.description_one,
              [language]: data.faq_description_one || "",
            }),
            faq_two: handleRemoveEmptyKey({
              ...resData?.faq?.faq_two,
              [language]: data.faq_title_two || "",
            }),
            description_two: handleRemoveEmptyKey({
              ...resData?.faq?.description_two,
              [language]: data.faq_description_two || "",
            }),
            faq_three: handleRemoveEmptyKey({
              ...resData?.faq?.faq_three,
              [language]: data.faq_title_three || "",
            }),
            description_three: handleRemoveEmptyKey({
              ...resData?.faq?.description_three,
              [language]: data.faq_description_three || "",
            }),
            faq_four: handleRemoveEmptyKey({
              ...resData?.faq?.faq_four,
              [language]: data.faq_title_four || "",
            }),
            description_four: handleRemoveEmptyKey({
              ...resData?.faq?.description_four,
              [language]: data.faq_description_four || "",
            }),
            faq_five: handleRemoveEmptyKey({
              ...resData?.faq?.faq_five,
              [language]: data.faq_title_five || "",
            }),
            description_five: handleRemoveEmptyKey({
              ...resData?.faq?.description_five,
              [language]: data.faq_description_five || "",
            }),
            faq_six: handleRemoveEmptyKey({
              ...resData?.faq?.faq_six,
              [language]: data.faq_title_six || "",
            }),
            description_six: handleRemoveEmptyKey({
              ...resData?.faq?.description_six,
              [language]: data.faq_description_six || "",
            }),
            faq_seven: handleRemoveEmptyKey({
              ...resData?.faq?.faq_seven,
              [language]: data.faq_title_seven || "",
            }),
            description_seven: handleRemoveEmptyKey({
              ...resData?.faq?.description_seven,
              [language]: data.faq_description_seven || "",
            }),
            faq_eight: handleRemoveEmptyKey({
              ...resData?.faq?.faq_eight,
              [language]: data.faq_title_eight || "",
            }),
            description_eight: handleRemoveEmptyKey({
              ...resData?.faq?.description_eight,
              [language]: data.faq_description_eight || "",
            }),
          },

          slider: {
            left_right_arrow: leftRightArrow,
            bottom_dots: bottomDots,
            both_slider: bothSliderOption,

            first_img: sliderImage,
            first_title: handleRemoveEmptyKey({
              ...resData?.slider?.first_title,
              [language]: data.slider_title || "",
            }),
            first_description: handleRemoveEmptyKey({
              ...resData?.slider?.first_description,
              [language]: data.slider_description || "",
            }),
            first_button: handleRemoveEmptyKey({
              ...resData?.slider?.first_button,
              [language]: data.slider_button_name || "",
            }),
            first_link: data.slider_button_link,

            second_img: sliderImageTwo,
            second_title: handleRemoveEmptyKey({
              ...resData?.slider?.second_title,
              [language]: data.slider_title_two || "",
            }),
            second_description: handleRemoveEmptyKey({
              ...resData?.slider?.second_description,
              [language]: data.slider_description_two || "",
            }),
            second_button: handleRemoveEmptyKey({
              ...resData?.slider?.second_button,
              [language]: data.slider_button_name_two || "",
            }),
            second_link: data.slider_button_link_two,

            third_img: sliderImageThree,
            third_title: handleRemoveEmptyKey({
              ...resData?.slider?.third_title,
              [language]: data.slider_title_three || "",
            }),
            third_description: handleRemoveEmptyKey({
              ...resData?.slider?.third_description,
              [language]: data.slider_description_three || "",
            }),
            third_button: handleRemoveEmptyKey({
              ...resData?.slider?.third_button,
              [language]: data.slider_button_name_three || "",
            }),
            third_link: data.slider_button_link_three,

            four_img: sliderImageFour,
            four_title: handleRemoveEmptyKey({
              ...resData?.slider?.four_title,
              [language]: data.slider_title_four || "",
            }),
            four_description: handleRemoveEmptyKey({
              ...resData?.slider?.four_description,
              [language]: data.slider_description_four || "",
            }),
            four_button: handleRemoveEmptyKey({
              ...resData?.slider?.four_button,
              [language]: data.slider_button_name_four || "",
            }),
            four_link: data.slider_button_link_four,

            five_img: sliderImageFive,
            five_title: handleRemoveEmptyKey({
              ...resData?.slider?.five_title,
              [language]: data.slider_title_five || "",
            }),
            five_description: handleRemoveEmptyKey({
              ...resData?.slider?.five_description,
              [language]: data.slider_description_five || "",
            }),
            five_button: handleRemoveEmptyKey({
              ...resData?.slider?.five_button,
              [language]: data.slider_button_name_five || "",
            }),
            five_link: data.slider_button_link_five,
          },

          checkout: {
            personal_details: handleRemoveEmptyKey({
              ...resData?.checkout?.personal_details,
              [language]: data.personal_details || "",
            }),
            first_name: handleRemoveEmptyKey({
              ...resData?.checkout?.first_name,
              [language]: data.first_name || "",
            }),
            last_name: handleRemoveEmptyKey({
              ...resData?.checkout?.last_name,
              [language]: data.last_name || "",
            }),
            email_address: handleRemoveEmptyKey({
              ...resData?.checkout?.email_address,
              [language]: data.email_address || "",
            }),
            checkout_phone: handleRemoveEmptyKey({
              ...resData?.checkout?.checkout_phone,
              [language]: data.checkout_phone || "",
            }),

            shipping_details: handleRemoveEmptyKey({
              ...resData?.checkout?.shipping_details,
              [language]: data.shipping_details || "",
            }),
            street_address: handleRemoveEmptyKey({
              ...resData?.checkout?.street_address,
              [language]: data.street_address || "",
            }),
            city: handleRemoveEmptyKey({
              ...resData?.checkout?.city,
              [language]: data.city || "",
            }),
            country: handleRemoveEmptyKey({
              ...resData?.checkout?.country,
              [language]: data.country || "",
            }),
            zip_code: handleRemoveEmptyKey({
              ...resData?.checkout?.zip_code,
              [language]: data.zip_code || "",
            }),
            shipping_cost: handleRemoveEmptyKey({
              ...resData?.checkout?.shipping_cost,
              [language]: data.shipping_cost || "",
            }),
            shipping_name_one: handleRemoveEmptyKey({
              ...resData?.checkout?.shipping_name_one,
              [language]: data.shipping_name_one || "",
            }),
            shipping_one_desc: handleRemoveEmptyKey({
              ...resData?.checkout?.shipping_one_desc,
              [language]: data.shipping_one_desc || "",
            }),
            shipping_one_cost: data?.shipping_one_cost,
            shipping_name_two: handleRemoveEmptyKey({
              ...resData?.checkout?.shipping_name_two,
              [language]: data.shipping_name_two || "",
            }),
            shipping_two_desc: handleRemoveEmptyKey({
              ...resData?.checkout?.shipping_two_desc,
              [language]: data.shipping_two_desc || "",
            }),
            shipping_two_cost: data?.shipping_two_cost,
            payment_method: handleRemoveEmptyKey({
              ...resData?.checkout?.payment_method,
              [language]: data.payment_method || "",
            }),
            continue_button: handleRemoveEmptyKey({
              ...resData?.checkout?.continue_button,
              [language]: data.continue_button || "",
            }),
            confirm_button: handleRemoveEmptyKey({
              ...resData?.checkout?.confirm_button,
              [language]: data.confirm_button || "",
            }),
            order_summary: handleRemoveEmptyKey({
              ...resData?.checkout?.order_summary,
              [language]: data.order_summary || "",
            }),
            apply_button: handleRemoveEmptyKey({
              ...resData?.checkout?.apply_button,
              [language]: data.apply_button || "",
            }),
            sub_total: handleRemoveEmptyKey({
              ...resData?.checkout?.sub_total,
              [language]: data.sub_total || "",
            }),
            discount: handleRemoveEmptyKey({
              ...resData?.checkout?.discount,
              [language]: data.discount || "",
            }),
            total_cost: handleRemoveEmptyKey({
              ...resData?.checkout?.total_cost,
              [language]: data.total_cost || "",
            }),
          },

          // Distance-Based Shipping Configuration
          distanceBasedShipping: {
            store_latitude: data?.store_latitude || null,
            store_longitude: data?.store_longitude || null,
            base_shipping_cost: data?.base_shipping_cost || 0,
            cost_per_km: data?.cost_per_km || 0,
            max_delivery_distance: data?.max_delivery_distance || null,
            free_delivery_radius: data?.free_delivery_radius || null,
            min_order_free_delivery: data?.min_order_free_delivery || null,
            enable_free_shipping: data?.enable_free_shipping || false,
          },

          dashboard: {
            invoice_message_first: handleRemoveEmptyKey({
              ...resData?.dashboard?.invoice_message_first,
              [language]: data.invoice_message_first || "",
            }),
            invoice_message_last: handleRemoveEmptyKey({
              ...resData?.dashboard?.invoice_message_last,
              [language]: data.invoice_message_last || "",
            }),
            print_button: handleRemoveEmptyKey({
              ...resData?.dashboard?.print_button,
              [language]: data.print_button || "",
            }),
            download_button: handleRemoveEmptyKey({
              ...resData?.dashboard?.download_button,
              [language]: data.download_button || "",
            }),
            dashboard_title: handleRemoveEmptyKey({
              ...resData?.dashboard?.dashboard_title,
              [language]: data.dashboard_title || "",
            }),
            total_order: handleRemoveEmptyKey({
              ...resData?.dashboard?.total_order,
              [language]: data.total_order || "",
            }),
            pending_order: handleRemoveEmptyKey({
              ...resData?.dashboard?.pending_order,
              [language]: data.pending_order || "",
            }),

            processing_order: handleRemoveEmptyKey({
              ...resData?.dashboard?.processing_order,
              [language]: data.processing_order || "",
            }),
            complete_order: handleRemoveEmptyKey({
              ...resData?.dashboard?.complete_order,
              [language]: data.complete_order || "",
            }),
            recent_order: handleRemoveEmptyKey({
              ...resData?.dashboard?.recent_order,
              [language]: data.recent_order || "",
            }),
            my_order: handleRemoveEmptyKey({
              ...resData?.dashboard?.my_order,
              [language]: data.my_order || "",
            }),
            update_profile: handleRemoveEmptyKey({
              ...resData?.dashboard?.update_profile,
              [language]: data.update_profile || "",
            }),
            full_name: handleRemoveEmptyKey({
              ...resData?.dashboard?.full_name,
              [language]: data.full_name || "",
            }),
            address: handleRemoveEmptyKey({
              ...resData?.dashboard?.address,
              [language]: data.address || "",
            }),
            user_phone: handleRemoveEmptyKey({
              ...resData?.dashboard?.user_phone,
              [language]: data.user_phone || "",
            }),
            user_email: handleRemoveEmptyKey({
              ...resData?.dashboard?.user_email,
              [language]: data.user_email || "",
            }),
            update_button: handleRemoveEmptyKey({
              ...resData?.dashboard?.update_button,
              [language]: data.update_button || "",
            }),
            current_password: handleRemoveEmptyKey({
              ...resData?.dashboard?.current_password,
              [language]: data.current_password || "",
            }),
            new_password: handleRemoveEmptyKey({
              ...resData?.dashboard?.new_password,
              [language]: data.new_password || "",
            }),
            change_password: handleRemoveEmptyKey({
              ...resData?.dashboard?.change_password,
              [language]: data.change_password || "",
            }),
          },
          footer: {
            promo_status: true,
            block1_status: footerBlock1,
            block2_status: footerBlock2,
            block3_status: footerBlock3,
            block4_status: footerBlock4,
            payment_method_status: footerPaymentMethod,
            bottom_contact_status: footerBottomContact,
            social_links_status: footerSocialLinks,

            shipping_card: handleRemoveEmptyKey({
              ...resData?.footer?.shipping_card,
              [language]: data.promo_free_shipping || "",
            }),
            support_card: handleRemoveEmptyKey({
              ...resData?.footer?.support_card,
              [language]: data.promo_support || "",
            }),
            payment_card: handleRemoveEmptyKey({
              ...resData?.footer?.payment_card,
              [language]: data.promo_payment || "",
            }),
            offer_card: handleRemoveEmptyKey({
              ...resData?.footer?.offer_card,
              [language]: data.promo_offer || "",
            }),

            block1_title: handleRemoveEmptyKey({
              ...resData?.footer?.block1_title,
              [language]: data.footer_block_one_title || "",
            }),

            block1_sub_title1: handleRemoveEmptyKey({
              ...resData?.footer?.block1_sub_title1,
              [language]: data.footer_block_one_link_one_title || "",
            }),
            block1_sub_link1: data.footer_block_one_link_one,

            block1_sub_title2: handleRemoveEmptyKey({
              ...resData?.footer?.block1_sub_title2,
              [language]: data.footer_block_one_link_two_title || "",
            }),
            block1_sub_link2: data.footer_block_one_link_two,

            block1_sub_title3: handleRemoveEmptyKey({
              ...resData?.footer?.block1_sub_title3,
              [language]: data.footer_block_one_link_three_title || "",
            }),
            block1_sub_link3: data.footer_block_one_link_three,

            block1_sub_title4: handleRemoveEmptyKey({
              ...resData?.footer?.block1_sub_title4,
              [language]: data.footer_block_one_link_four_title || "",
            }),
            block1_sub_link4: data.footer_block_one_link_four,

            block2_title: handleRemoveEmptyKey({
              ...resData?.footer?.block2_title,
              [language]: data.footer_block_two_title || "",
            }),

            block2_sub_title1: handleRemoveEmptyKey({
              ...resData?.footer?.block2_sub_title1,
              [language]: data.footer_block_two_link_one_title || "",
            }),
            block2_sub_link1: data.footer_block_two_link_one,

            block2_sub_title2: handleRemoveEmptyKey({
              ...resData?.footer?.block2_sub_title2,
              [language]: data.footer_block_two_link_two_title || "",
            }),
            block2_sub_link2: data.footer_block_two_link_two,

            block2_sub_title3: handleRemoveEmptyKey({
              ...resData?.footer?.block2_sub_title3,
              [language]: data.footer_block_two_link_three_title || "",
            }),
            block2_sub_link3: data.footer_block_two_link_three,

            block2_sub_title4: handleRemoveEmptyKey({
              ...resData?.footer?.block2_sub_title4,
              [language]: data.footer_block_two_link_four_title || "",
            }),
            block2_sub_link4: data.footer_block_two_link_four,

            block3_title: handleRemoveEmptyKey({
              ...resData?.footer?.block3_title,
              [language]: data.footer_block_three_title || "",
            }),

            block3_sub_title1: handleRemoveEmptyKey({
              ...resData?.footer?.block3_sub_title1,
              [language]: data.footer_block_three_link_one_title || "",
            }),
            block3_sub_link1: data.footer_block_three_link_one,

            block3_sub_title2: handleRemoveEmptyKey({
              ...resData?.footer?.block3_sub_title2,
              [language]: data.footer_block_three_link_two_title || "",
            }),
            block3_sub_link2: data.footer_block_three_link_two,

            block3_sub_title3: handleRemoveEmptyKey({
              ...resData?.footer?.block3_sub_title3,
              [language]: data.footer_block_three_link_three_title || "",
            }),
            block3_sub_link3: data.footer_block_three_link_three,

            block3_sub_title4: handleRemoveEmptyKey({
              ...resData?.footer?.block3_sub_title4,
              [language]: data.footer_block_three_link_four_title || "",
            }),
            block3_sub_link4: data.footer_block_three_link_four,

            footer_block_four_link_one: data.footer_block_four_link_one,
            block4_logo: footerLogo,
            block4_address: handleRemoveEmptyKey({
              ...resData?.footer?.block4_address,
              [language]: data.footer_block_four_address || "",
            }),
            social_facebook: data.social_facebook,
            social_twitter: data.social_twitter,
            social_pinterest: data.social_pinterest,
            social_linkedin: data.social_linkedin,
            social_whatsapp: data.social_whatsapp,
            payment_method_img: paymentImage,
            block4_phone: data.footer_block_four_phone,
            block4_email: data.footer_block_four_email,
            bottom_contact: data.footer_Bottom_Contact,
          },
          slug: {
            right_box_status: singleProductPageRightBox,

            // slug_page_card_icon_one: data.slug_page_card_icon_one,
            card_description_one: handleRemoveEmptyKey({
              ...resData?.slug?.card_description_one,
              [language]: data.slug_page_card_description_one || "",
            }),

            // slug_page_card_icon_two: data.slug_page_card_icon_two,
            card_description_two: handleRemoveEmptyKey({
              ...resData?.slug?.card_description_two,
              [language]: data.slug_page_card_description_two || "",
            }),

            // slug_page_card_icon_three: data.slug_page_card_icon_three,
            card_description_three: handleRemoveEmptyKey({
              ...resData?.slug?.card_description_three,
              [language]: data.slug_page_card_description_three || "",
            }),

            // slug_page_card_icon_four: data.slug_page_card_icon_four,
            card_description_four: handleRemoveEmptyKey({
              ...resData?.slug?.card_description_four,
              [language]: data.slug_page_card_description_four || "",
            }),

            // slug_page_card_icon_five: data.slug_page_card_icon_five,

            card_description_five: handleRemoveEmptyKey({
              ...resData?.slug?.card_description_five,
              [language]: data.slug_page_card_description_five || "",
            }),

            // slug_page_card_icon_six: data.slug_page_card_icon_six,

            card_description_six: handleRemoveEmptyKey({
              ...resData?.slug?.card_description_six,
              [language]: data.slug_page_card_description_six || "",
            }),

            // slug_page_card_icon_seven: data.slug_page_card_icon_seven,

            card_description_seven: handleRemoveEmptyKey({
              ...resData?.slug?.card_description_seven,
              [language]: data.slug_page_card_description_seven || "",
            }),
          },
          seo: {
            //for seo
            meta_img: metaImg,
            favicon: favicon,
            meta_title: data.meta_title,
            meta_description: data.meta_description,
            meta_url: data.meta_url,
            meta_keywords: data.meta_keywords,
          },
        },
      };

      // console.log(
      //   "storeCustomizationSettingData submit",
      //   storeCustomizationSettingData
      // );
      // setIsSubmitting(false);
      // return;

      console.log("🔍 Form submission - isSave value:", isSave);
      console.log("🔍 Founder data being submitted:", {
        founder_two_name: storeCustomizationSettingData.setting.about_us.founder_two_name,
        founder_two_position: storeCustomizationSettingData.setting.about_us.founder_two_position,
        founder_three_name: storeCustomizationSettingData.setting.about_us.founder_three_name,
        founder_three_position: storeCustomizationSettingData.setting.about_us.founder_three_position,
        founder_four_name: storeCustomizationSettingData.setting.about_us.founder_four_name,
        founder_four_position: storeCustomizationSettingData.setting.about_us.founder_four_position,
        founder_five_name: storeCustomizationSettingData.setting.about_us.founder_five_name,
        founder_five_position: storeCustomizationSettingData.setting.about_us.founder_five_position,
        founder_six_name: storeCustomizationSettingData.setting.about_us.founder_six_name,
        founder_six_position: storeCustomizationSettingData.setting.about_us.founder_six_position,
      });
      
      console.log("🔍 Complete about_us data structure:", JSON.stringify(storeCustomizationSettingData.setting.about_us, null, 2));
      if (!isSave) {
        console.log("🔄 Calling updateStoreCustomizationSetting...");
        const res = await SettingServices.updateStoreCustomizationSetting(
          storeCustomizationSettingData
        );
        // await socket.emit("notification", {
        //   message: `storeCustomizationSetting setting added`,
        //   option: "storeCustomizationSetting",
        // });

        setIsUpdate(true);
        setIsSubmitting(false);

        window.location.reload();
        notifySuccess(res.message);
      } else {
        console.log("🆕 Calling addStoreCustomizationSetting...");
        const res = await SettingServices.addStoreCustomizationSetting(
          storeCustomizationSettingData
        );
        // await socket.emit("notification", {
        //   message: `storeCustomizationSetting setting updated`,
        //   option: "storeCustomizationSetting",
        // });

        setIsUpdate(true);
        setIsSubmitting(false);

        window.location.reload();
        notifySuccess(res.message);
      }
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const getStoreCustomizationData = async () => {
      try {
        const res = await SettingServices.getStoreCustomizationSetting();

        console.log("🔍 getStoreCustomizationSetting response:", res);

        if (res) {
          console.log("✅ Data loaded successfully, setting isSave to false");
          setIsSave(false);
          setResData(res);

          //navbar

          setCategoriesMenuLink(res?.navbar?.categories_menu_status);
          setAboutUsMenuLink(res?.navbar?.about_menu_status);
          setContactUsMenuLink(res?.navbar?.contact_menu_status);
          setOffersMenuLink(res?.navbar?.offers_menu_status);
          setFaqMenuLink(res?.navbar?.faq_status);
          setPrivacyPolicyMenuLink(res?.navbar?.privacy_policy_status);
          setTermsConditionsMenuLink(res?.navbar?.term_and_condition_status);
          setValue("help_text", res?.navbar?.help_text[language || "en"]);

          setValue("categories", res?.navbar?.categories[language || "en"]);
          setValue("about_us", res?.navbar?.about_us[language || "en"]);
          setValue("contact_us", res?.navbar?.contact_us[language || "en"]);
          setValue("offers", res?.navbar?.offers[language || "en"]);
          setValue("faq", res?.navbar?.faq[language || "en"]);
          setValue(
            "privacy_policy",
            res?.navbar?.privacy_policy[language || "en"]
          );
          setValue(
            "term_and_condition",
            res?.navbar?.term_and_condition[language || "en"]
          );

          setValue("pages", res?.navbar?.pages[language || "en"]);
          setValue("my_account", res?.navbar?.my_account[language || "en"]);
          setValue("login", res?.navbar?.login[language || "en"]);
          setValue("logout", res?.navbar?.logout[language || "en"]);
          setValue("checkout", res?.navbar?.checkout[language || "en"]);
          setHeaderLogo(res?.navbar?.logo);
          setValue("phone_number", res?.navbar?.phone);

          //home

          setPlaceHolderImage(res?.home?.place_holder_img);
          setQuickSectionImage(res?.home?.quick_delivery_img);
          setGetYourDailyNeedImageLeft(res?.home?.daily_need_img_left);
          setGetYourDailyNeedImageRight(res?.home?.daily_need_img_right);
          setGetButton1image(res?.home?.button1_img);
          setGetButton2image(res?.home?.button2_img);
          setIsCoupon(res?.home?.coupon_status);
          setIsSliderFullWidth(res?.home?.slider_width_status);
          setAllowPromotionBanner(res?.home?.promotion_banner_status);
          setPopularProducts(res?.home?.popular_products_status);
          setFeaturedCategories(res?.home?.featured_status);
          setQuickDelivery(res?.home?.delivery_status);
          setLatestDiscounted(res?.home?.discount_product_status);
          setDailyNeeds(res?.home?.daily_needs_status);
          setFeaturePromo(res?.home?.feature_promo_status);
          // setCouponList(res?.home?.discount_coupon_code);
          const discountCouponCode = res?.home?.discount_coupon_code?.map(
            (coupon) => {
              const newObj = {
                label: coupon,
                value: coupon,
              };
              return newObj;
            }
          );
          setCouponList(discountCouponCode || []);

          setValue(
            "discount_title",
            res?.home?.discount_title[language || "en"]
          );
          setValue(
            "promotion_title",
            res?.home?.promotion_title[language || "en"]
          );
          setValue(
            "promotion_description",
            res?.home?.promotion_description[language || "en"]
          );
          setValue(
            "promotion_button_name",
            res?.home?.promotion_button_name[language || "en"]
          );
          setValue("promotion_button_link", res?.home?.promotion_button_link);
          setValue("feature_title", res?.home?.feature_title[language || "en"]);
          setValue(
            "feature_description",
            res?.home?.feature_description[language || "en"]
          );
          setValue("feature_product_limit", res?.home?.feature_product_limit);
          setValue("popular_title", res?.home?.popular_title[language || "en"]);
          setValue(
            "popular_description",
            res?.home?.popular_description[language || "en"]
          );
          setValue("popular_product_limit", res?.home?.popular_product_limit);
          setValue(
            "quick_delivery_subtitle",
            res?.home?.quick_delivery_subtitle[language || "en"]
          );
          setValue(
            "quick_delivery_title",
            res?.home?.quick_delivery_title[language || "en"]
          );
          setValue(
            "quick_delivery_description",
            res?.home?.quick_delivery_description[language || "en"]
          );
          setValue(
            "quick_delivery_button",
            res?.home?.quick_delivery_button[language || "en"]
          );
          setValue("quick_delivery_link", res?.home?.quick_delivery_link);
          setValue(
            "latest_discount_title",
            res?.home?.latest_discount_title[language || "en"]
          );
          setValue(
            "latest_discount_description",
            res?.home?.latest_discount_description[language || "en"]
          );
          setValue(
            "latest_discount_product_limit",
            res?.home?.latest_discount_product_limit
          );
          setValue(
            "daily_need_title",
            res?.home?.daily_need_title[language || "en"]
          );
          setValue(
            "daily_need_description",
            res?.home?.daily_need_description[language || "en"]
          );
          setValue("daily_need_app_link", res?.home?.daily_need_app_link);
          setValue("daily_need_google_link", res?.home?.daily_need_google_link);

          //slider
          setSliderImage(res?.slider?.first_img);
          setSliderImageTwo(res?.slider?.second_img);
          setSliderImageThree(res?.slider?.third_img);
          setSliderImageFour(res?.slider?.four_img);
          setSliderImageFive(res?.slider?.five_img);
          setLeftRightArrow(res?.slider?.left_right_arrow);
          setBottomDots(res?.slider?.bottom_dots);
          setBothSliderOption(res?.slider?.both_slider);

          setValue("slider_title", res?.slider?.first_title[language || "en"]);
          setValue(
            "slider_description",
            res?.slider?.first_description[language || "en"]
          );
          setValue(
            "slider_button_name",
            res?.slider?.first_button[language || "en"]
          );
          setValue("slider_button_link", res?.slider?.first_link);
          setValue(
            "slider_title_two",
            res?.slider?.second_title[language || "en"]
          );
          setValue(
            "slider_description_two",
            res?.slider?.second_description[language || "en"]
          );
          setValue(
            "slider_button_name_two",
            res?.slider?.second_button[language || "en"]
          );
          setValue("slider_button_link_two", res?.slider?.second_link);
          setValue(
            "slider_title_three",
            res?.slider?.third_title[language || "en"]
          );
          setValue(
            "slider_description_three",
            res?.slider?.third_description[language || "en"]
          );
          setValue(
            "slider_button_name_three",
            res?.slider?.third_button[language || "en"]
          );
          setValue("slider_button_link_three", res?.slider?.third_link);
          setValue(
            "slider_title_four",
            res?.slider?.four_title[language || "en"]
          );
          setValue(
            "slider_description_four",
            res?.slider?.four_description[language || "en"]
          );
          setValue(
            "slider_button_name_four",
            res?.slider?.four_button[language || "en"]
          );
          setValue("slider_button_link_four", res?.slider?.four_link);
          setValue(
            "slider_title_five",
            res?.slider?.five_title[language || "en"]
          );
          setValue(
            "slider_description_five",
            res?.slider?.five_description[language || "en"]
          );
          setValue(
            "slider_button_name_five",
            res?.slider?.five_button[language || "en"]
          );
          setValue("slider_button_link_five", res?.slider?.five_link);

          //checkout
          setValue(
            "personal_details",
            res?.checkout?.personal_details[language || "en"]
          );
          setValue("first_name", res?.checkout?.first_name[language || "en"]);
          setValue("last_name", res?.checkout?.last_name[language || "en"]);
          setValue(
            "email_address",
            res?.checkout?.email_address[language || "en"]
          );
          setValue(
            "checkout_phone",
            res?.checkout?.checkout_phone[language || "en"]
          );
          setValue(
            "shipping_details",
            res?.checkout?.shipping_details[language || "en"]
          );
          setValue(
            "street_address",
            res?.checkout?.street_address[language || "en"]
          );
          setValue("city", res?.checkout?.city[language || "en"]);
          setValue("country", res?.checkout?.country[language || "en"]);
          setValue("zip_code", res?.checkout?.zip_code[language || "en"]);
          setValue(
            "shipping_cost",
            res?.checkout?.shipping_cost[language || "en"]
          );
          setValue(
            "shipping_name_one",
            res?.checkout?.shipping_name_one[language || "en"]
          );
          setValue(
            "shipping_one_desc",
            res?.checkout?.shipping_one_desc[language || "en"]
          );
          setValue("shipping_one_cost", res?.checkout?.shipping_one_cost);
          setValue(
            "shipping_name_two",
            res?.checkout?.shipping_name_two[language || "en"]
          );
          setValue(
            "shipping_two_desc",
            res?.checkout?.shipping_two_desc[language || "en"]
          );
          setValue("shipping_two_cost", res?.checkout?.shipping_two_cost);
          setValue(
            "payment_method",
            res?.checkout?.payment_method[language || "en"]
          );
          setValue(
            "continue_button",
            res?.checkout?.continue_button[language || "en"]
          );
          setValue(
            "confirm_button",
            res?.checkout?.confirm_button[language || "en"]
          );
          setValue(
            "order_summary",
            res?.checkout?.order_summary[language || "en"]
          );
          setValue(
            "apply_button",
            res?.checkout?.apply_button[language || "en"]
          );
          setValue("sub_total", res?.checkout?.sub_total[language || "en"]);
          setValue("discount", res?.checkout?.discount[language || "en"]);
          setValue("total_cost", res?.checkout?.total_cost[language || "en"]);

          // Distance-Based Shipping Settings
          setValue("store_latitude", res?.distanceBasedShipping?.store_latitude || "");
          setValue("store_longitude", res?.distanceBasedShipping?.store_longitude || "");
          setValue("base_shipping_cost", res?.distanceBasedShipping?.base_shipping_cost || "");
          setValue("cost_per_km", res?.distanceBasedShipping?.cost_per_km || "");
          setValue("max_delivery_distance", res?.distanceBasedShipping?.max_delivery_distance || "");
          setValue("free_delivery_radius", res?.distanceBasedShipping?.free_delivery_radius || "");
          setValue("min_order_free_delivery", res?.distanceBasedShipping?.min_order_free_delivery || "");
          setValue("enable_free_shipping", res?.distanceBasedShipping?.enable_free_shipping !== false); // Default to true

          //dashboard
          setValue(
            "invoice_message_first",
            res?.dashboard?.invoice_message_first[language || "en"]
          );
          setValue(
            "invoice_message_last",
            res?.dashboard?.invoice_message_last[language || "en"]
          );
          setValue(
            "print_button",
            res?.dashboard?.print_button[language || "en"]
          );
          setValue(
            "download_button",
            res?.dashboard?.download_button[language || "en"]
          );
          setValue(
            "dashboard_title",
            res?.dashboard?.dashboard_title[language || "en"]
          );
          setValue(
            "total_order",
            res?.dashboard?.total_order[language || "en"]
          );
          setValue(
            "pending_order",
            res?.dashboard?.pending_order[language || "en"]
          );
          setValue(
            "processing_order",
            res?.dashboard?.processing_order[language || "en"]
          );
          setValue(
            "complete_order",
            res?.dashboard?.complete_order[language || "en"]
          );
          setValue(
            "recent_order",
            res?.dashboard?.recent_order[language || "en"]
          );
          setValue("my_order", res?.dashboard?.my_order[language || "en"]);
          setValue(
            "update_profile",
            res?.dashboard?.update_profile[language || "en"]
          );
          setValue("full_name", res?.dashboard?.full_name[language || "en"]);
          setValue("address", res?.dashboard?.address[language || "en"]);
          setValue("user_phone", res?.dashboard?.user_phone[language || "en"]);
          setValue("user_email", res?.dashboard?.user_email[language || "en"]);
          setValue(
            "update_button",
            res?.dashboard?.update_button[language || "en"]
          );
          setValue(
            "current_password",
            res?.dashboard?.current_password[language || "en"]
          );
          setValue(
            "new_password",
            res?.dashboard?.new_password[language || "en"]
          );
          setValue(
            "change_password",
            res?.dashboard?.change_password[language || "en"]
          );

          //footer
          setFooterBlock1(res?.footer?.block1_status);
          setFooterBlock2(res?.footer?.block2_status);
          setFooterBlock3(res?.footer?.block3_status);
          setFooterBlock4(res?.footer?.block4_status);
          setFooterLogo(res?.footer?.block4_logo);
          setPaymentImage(res?.footer?.payment_method_img);
          setFooterSocialLinks(res?.footer?.social_links_status);
          setFooterPaymentMethod(res?.footer?.payment_method_status);
          setFooterBottomContact(res?.footer?.bottom_contact_status);

          setValue(
            "promo_free_shipping",
            res?.footer?.shipping_card[language || "en"]
          );
          setValue(
            "promo_support",
            res?.footer?.support_card[language || "en"]
          );
          setValue(
            "promo_payment",
            res?.footer?.payment_card[language || "en"]
          );
          setValue("promo_offer", res?.footer?.offer_card[language || "en"]);
          setValue(
            "footer_block_one_title",
            res?.footer?.block1_title[language || "en"]
          );

          setValue("footer_block_one_link_one", res?.footer?.block1_sub_link1);
          setValue("footer_block_one_link_two", res?.footer?.block1_sub_link2);
          setValue(
            "footer_block_one_link_three",
            res?.footer?.block1_sub_link3
          );
          setValue("footer_block_one_link_four", res?.footer?.block1_sub_link4);

          setValue(
            "footer_block_one_link_one_title",
            res?.footer?.block1_sub_title1[language || "en"]
          );
          setValue(
            "footer_block_one_link_two_title",
            res?.footer?.block1_sub_title2[language || "en"]
          );
          setValue(
            "footer_block_one_link_three_title",
            res?.footer?.block1_sub_title3[language || "en"]
          );
          setValue(
            "footer_block_one_link_four_title",
            res?.footer?.block1_sub_title4[language || "en"]
          );

          setValue(
            "footer_block_two_title",
            res?.footer?.block2_title[language || "en"]
          );
          setValue("footer_block_two_link_one", res?.footer?.block2_sub_link1);
          setValue("footer_block_two_link_two", res?.footer?.block2_sub_link2);
          setValue(
            "footer_block_two_link_three",
            res?.footer?.block2_sub_link3
          );
          setValue("footer_block_two_link_four", res?.footer?.block2_sub_link4);

          setValue(
            "footer_block_two_link_one_title",
            res?.footer?.block2_sub_title1[language || "en"]
          );
          setValue(
            "footer_block_two_link_two_title",
            res?.footer?.block2_sub_title2[language || "en"]
          );
          setValue(
            "footer_block_two_link_three_title",
            res?.footer?.block2_sub_title3[language || "en"]
          );
          setValue(
            "footer_block_two_link_four_title",
            res?.footer?.block2_sub_title4[language || "en"]
          );

          setValue(
            "footer_block_three_title",
            res?.footer?.block3_title[language || "en"]
          );
          setValue(
            "footer_block_three_link_one",
            res?.footer?.block3_sub_link1
          );
          setValue(
            "footer_block_three_link_two",
            res?.footer?.block3_sub_link2
          );
          setValue(
            "footer_block_three_link_three",
            res?.footer?.block3_sub_link3
          );
          setValue(
            "footer_block_three_link_four",
            res?.footer?.block3_sub_link4
          );

          setValue(
            "footer_block_three_link_one_title",
            res?.footer?.block3_sub_title1[language || "en"]
          );
          setValue(
            "footer_block_three_link_two_title",
            res?.footer?.block3_sub_title2[language || "en"]
          );
          setValue(
            "footer_block_three_link_three_title",
            res?.footer?.block3_sub_title3[language || "en"]
          );
          setValue(
            "footer_block_three_link_four_title",
            res?.footer?.block3_sub_title4[language || "en"]
          );

          setValue(
            "footer_block_four_address",
            res?.footer?.block4_address[language || "en"]
          );
          setValue("footer_block_four_phone", res?.footer?.block4_phone);
          setValue("footer_block_four_email", res?.footer?.block4_email);

          setValue("social_facebook", res?.footer?.social_facebook);
          setValue("social_twitter", res?.footer?.social_twitter);
          setValue("social_pinterest", res?.footer?.social_pinterest);
          setValue("social_linkedin", res?.footer?.social_linkedin);
          setValue("social_whatsapp", res?.footer?.social_whatsapp);
          setValue("footer_Bottom_Contact", res?.footer?.bottom_contact);

          // slug
          setSingleProductPageRightBox(res?.slug?.right_box_status);
          setValue(
            "slug_page_card_icon_one",
            res?.slug?.slug_page_card_icon_one
          );
          setValue(
            "slug_page_card_description_one",
            res?.slug?.card_description_one[language || "en"]
          );

          setValue(
            "slug_page_card_icon_two",
            res?.slug?.slug_page_card_icon_two
          );
          setValue(
            "slug_page_card_description_two",
            res?.slug?.card_description_two[language || "en"]
          );

          setValue(
            "slug_page_card_icon_three",
            res?.slug?.slug_page_card_icon_three
          );
          setValue(
            "slug_page_card_description_three",
            res?.slug?.card_description_three[language || "en"]
          );

          setValue(
            "slug_page_card_icon_four",
            res?.slug?.slug_page_card_icon_four
          );
          setValue(
            "slug_page_card_description_four",
            res?.slug?.card_description_four[language || "en"]
          );

          setValue(
            "slug_page_card_icon_five",
            res?.slug?.slug_page_card_icon_five
          );
          setValue(
            "slug_page_card_description_five",
            res?.slug?.card_description_five[language || "en"]
          );

          setValue(
            "slug_page_card_icon_six",
            res?.slug?.slug_page_card_icon_six
          );
          setValue(
            "slug_page_card_description_six",
            res?.slug?.card_description_six[language || "en"]
          );

          setValue(
            "slug_page_card_icon_seven",
            res?.slug?.slug_page_card_icon_seven
          );
          setValue(
            "slug_page_card_description_seven",
            res?.slug?.card_description_seven[language || "en"]
          );

          // about us

          setAboutPageHeader(res?.about_us?.header_status);
          setAboutHeaderBg(res?.about_us?.header_bg);
          setAboutTopContentLeft(res?.about_us?.content_left_status);
          setAboutTopContentRight(res?.about_us?.content_right_status);
          setAboutTopContentRightImage(res?.about_us?.top_section_image);
          setAboutMiddleContentSection(res?.about_us?.content_middle_status);
          setAboutMiddleContentImage(res?.about_us?.content_middle_Img);
          setOurFounderSection(res?.about_us?.founder_status);
          setOurFounderOneImage(res?.about_us?.founder_one_img);
          setOurFounderTwoImage(res?.about_us?.founder_two_img);
          setOurFounderThreeImage(res?.about_us?.founder_three_img);
          setOurFounderFourImage(res?.about_us?.founder_four_img);
          setOurFounderFiveImage(res?.about_us?.founder_five_img);
          setOurFounderSixImage(res?.about_us?.founder_six_img);
          setValue("about_page_title_en", res?.about_us?.title?.en || "");
          setValue("about_page_title_ar", res?.about_us?.title?.ar || "");
          setValue(
                          "about_page_hero_description_en",
                          res?.about_us?.hero_description?.en || ""
          );
          setValue(
                          "about_page_hero_description_ar",
                          res?.about_us?.hero_description?.ar || ""
          );
          setValue(
                          "about_page_top_section_title_en",
                          res?.about_us?.top_section_title?.en || ""
          );
          setValue(
                          "about_page_top_section_title_ar",
                          res?.about_us?.top_section_title?.ar || ""
          );
          setValue(
                          "about_page_top_section_description_en",
                          res?.about_us?.top_section_description?.en || ""
          );
          setValue(
                          "about_page_top_section_description_ar",
                          res?.about_us?.top_section_description?.ar || ""
          );
          // Card One - Bilingual
          setValue(
            "about_page_card_one_title_en",
            res?.about_us?.card_one_title?.en || ""
          );
          setValue(
            "about_page_card_one_title_ar",
            res?.about_us?.card_one_title?.ar || ""
          );
          setValue(
            "about_page_card_one_subtitle_en",
            res?.about_us?.card_one_sub?.en || ""
          );
          setValue(
            "about_page_card_one_subtitle_ar",
            res?.about_us?.card_one_sub?.ar || ""
          );
          setValue(
            "about_page_card_one_description_en",
            res?.about_us?.card_one_description?.en || ""
          );
          setValue(
            "about_page_card_one_description_ar",
            res?.about_us?.card_one_description?.ar || ""
          );
          
          // Card Two - Bilingual
          setValue(
            "about_page_card_two_title_en",
            res?.about_us?.card_two_title?.en || ""
          );
          setValue(
            "about_page_card_two_title_ar",
            res?.about_us?.card_two_title?.ar || ""
          );
          setValue(
            "about_page_card_two_subtitle_en",
            res?.about_us?.card_two_sub?.en || ""
          );
          setValue(
            "about_page_card_two_subtitle_ar",
            res?.about_us?.card_two_sub?.ar || ""
          );
          setValue(
            "about_page_card_two_description_en",
            res?.about_us?.card_two_description?.en || ""
          );
          setValue(
            "about_page_card_two_description_ar",
            res?.about_us?.card_two_description?.ar || ""
          );
          setValue(
            "about_us_middle_description_one",
            res?.about_us?.middle_description_one[language || "en"]
          );
          setValue(
            "about_us_middle_description_two",
            res?.about_us?.middle_description_two[language || "en"]
          );
          setValue(
            "about_page_ourfounder_title",
            res?.about_us?.founder_title[language || "en"]
          );
          setValue(
            "about_us_ourfounder_description",
            res?.about_us?.founder_description[language || "en"]
          );
          // Founder One - Bilingual
          setValue(
            "about_page_founder_one_name_en",
            res?.about_us?.founder_one_name?.en || ""
          );
          setValue(
            "about_page_founder_one_name_ar",
            res?.about_us?.founder_one_name?.ar || ""
          );
          setValue(
            "about_page_founder_one_position_en",
            res?.about_us?.founder_one_position?.en || ""
          );
          setValue(
            "about_page_founder_one_position_ar",
            res?.about_us?.founder_one_position?.ar || ""
          );
          // Founder Two - Bilingual
          setValue(
            "about_page_founder_two_name_en",
            res?.about_us?.founder_two_name?.en || ""
          );
          setValue(
            "about_page_founder_two_name_ar",
            res?.about_us?.founder_two_name?.ar || ""
          );
          setValue(
            "about_page_founder_two_position_en",
            res?.about_us?.founder_two_position?.en || ""
          );
          setValue(
            "about_page_founder_two_position_ar",
            res?.about_us?.founder_two_position?.ar || ""
          );
          // Founder Three - Bilingual
          setValue(
            "about_page_founder_three_name_en",
            res?.about_us?.founder_three_name?.en || ""
          );
          setValue(
            "about_page_founder_three_name_ar",
            res?.about_us?.founder_three_name?.ar || ""
          );
          setValue(
            "about_page_founder_three_position_en",
            res?.about_us?.founder_three_position?.en || ""
          );
          setValue(
            "about_page_founder_three_position_ar",
            res?.about_us?.founder_three_position?.ar || ""
          );
          // Founder Four - Bilingual
          setValue(
            "about_page_founder_four_name_en",
            res?.about_us?.founder_four_name?.en || ""
          );
          setValue(
            "about_page_founder_four_name_ar",
            res?.about_us?.founder_four_name?.ar || ""
          );
          setValue(
            "about_page_founder_four_position_en",
            res?.about_us?.founder_four_position?.en || ""
          );
          setValue(
            "about_page_founder_four_position_ar",
            res?.about_us?.founder_four_position?.ar || ""
          );
          // Founder Five - Bilingual
          setValue(
            "about_page_founder_five_name_en",
            res?.about_us?.founder_five_name?.en || ""
          );
          setValue(
            "about_page_founder_five_name_ar",
            res?.about_us?.founder_five_name?.ar || ""
          );
          setValue(
            "about_page_founder_five_position_en",
            res?.about_us?.founder_five_position?.en || ""
          );
          setValue(
            "about_page_founder_five_position_ar",
            res?.about_us?.founder_five_position?.ar || ""
          );
          // Founder Six - Bilingual
          setValue(
            "about_page_founder_six_name_en",
            res?.about_us?.founder_six_name?.en || ""
          );
          setValue(
            "about_page_founder_six_name_ar",
            res?.about_us?.founder_six_name?.ar || ""
          );
          setValue(
            "about_page_founder_six_position_en",
            res?.about_us?.founder_six_position?.en || ""
          );
          setValue(
            "about_page_founder_six_position_ar",
            res?.about_us?.founder_six_position?.ar || ""
          );

          // Founder Seven - Bilingual
          setValue(
            "about_page_founder_seven_name_en",
            res?.about_us?.founder_seven_name?.en || ""
          );
          setValue(
            "about_page_founder_seven_name_ar",
            res?.about_us?.founder_seven_name?.ar || ""
          );
          setValue(
            "about_page_founder_seven_position_en",
            res?.about_us?.founder_seven_position?.en || ""
          );
          setValue(
            "about_page_founder_seven_position_ar",
            res?.about_us?.founder_seven_position?.ar || ""
          );
          // Founder Eight - Bilingual
          setValue(
            "about_page_founder_eight_name_en",
            res?.about_us?.founder_eight_name?.en || ""
          );
          setValue(
            "about_page_founder_eight_name_ar",
            res?.about_us?.founder_eight_name?.ar || ""
          );
          setValue(
            "about_page_founder_eight_position_en",
            res?.about_us?.founder_eight_position?.en || ""
          );
          setValue(
            "about_page_founder_eight_position_ar",
            res?.about_us?.founder_eight_position?.ar || ""
          );
          // Founder Nine - Bilingual
          setValue(
            "about_page_founder_nine_name_en",
            res?.about_us?.founder_nine_name?.en || ""
          );
          setValue(
            "about_page_founder_nine_name_ar",
            res?.about_us?.founder_nine_name?.ar || ""
          );
          setValue(
            "about_page_founder_nine_position_en",
            res?.about_us?.founder_nine_position?.en || ""
          );
          setValue(
            "about_page_founder_nine_position_ar",
            res?.about_us?.founder_nine_position?.ar || ""
          );
          // Founder Ten - Bilingual
          setValue(
            "about_page_founder_ten_name_en",
            res?.about_us?.founder_ten_name?.en || ""
          );
          setValue(
            "about_page_founder_ten_name_ar",
            res?.about_us?.founder_ten_name?.ar || ""
          );
          setValue(
            "about_page_founder_ten_position_en",
            res?.about_us?.founder_ten_position?.en || ""
          );
          setValue(
            "about_page_founder_ten_position_ar",
            res?.about_us?.founder_ten_position?.ar || ""
          );
          // Founder Eleven - Bilingual
          setValue(
            "about_page_founder_eleven_name_en",
            res?.about_us?.founder_eleven_name?.en || ""
          );
          setValue(
            "about_page_founder_eleven_name_ar",
            res?.about_us?.founder_eleven_name?.ar || ""
          );
          setValue(
            "about_page_founder_eleven_position_en",
            res?.about_us?.founder_eleven_position?.en || ""
          );
          setValue(
            "about_page_founder_eleven_position_ar",
            res?.about_us?.founder_eleven_position?.ar || ""
          );
          // Founder Twelve - Bilingual
          setValue(
            "about_page_founder_twelve_name_en",
            res?.about_us?.founder_twelve_name?.en || ""
          );
          setValue(
            "about_page_founder_twelve_name_ar",
            res?.about_us?.founder_twelve_name?.ar || ""
          );
          setValue(
            "about_page_founder_twelve_position_en",
            res?.about_us?.founder_twelve_position?.en || ""
          );
          setValue(
            "about_page_founder_twelve_position_ar",
            res?.about_us?.founder_twelve_position?.ar || ""
          );

          // Add other missing fields
          setValue(
                          "about_page_trusted_badge_one_pill_en",
                          res?.about_us?.trusted_badge_one_pill?.en || ""
          );
          setValue(
                          "about_page_trusted_badge_one_pill_ar",
                          res?.about_us?.trusted_badge_one_pill?.ar || ""
          );
          setValue(
                          "about_page_trusted_badge_one_text_en",
                          res?.about_us?.trusted_badge_one_text?.en || ""
          );
          setValue(
                          "about_page_trusted_badge_one_text_ar",
                          res?.about_us?.trusted_badge_one_text?.ar || ""
          );
          setValue(
                          "about_page_trusted_badge_two_pill_en",
                          res?.about_us?.trusted_badge_two_pill?.en || ""
          );
          setValue(
                          "about_page_trusted_badge_two_pill_ar",
                          res?.about_us?.trusted_badge_two_pill?.ar || ""
          );
          setValue(
                          "about_page_trusted_badge_two_text_en",
                          res?.about_us?.trusted_badge_two_text?.en || ""
          );
          setValue(
                          "about_page_trusted_badge_two_text_ar",
                          res?.about_us?.trusted_badge_two_text?.ar || ""
          );

          // Add heritage section - Bilingual
          setValue(
            "about_page_heritage_title_en",
            res?.about_us?.heritage_title?.en || ""
          );
          setValue(
            "about_page_heritage_title_ar",
            res?.about_us?.heritage_title?.ar || ""
          );
          setValue(
            "about_page_heritage_description_one_en",
            res?.about_us?.heritage_description_one?.en || ""
          );
          setValue(
            "about_page_heritage_description_one_ar",
            res?.about_us?.heritage_description_one?.ar || ""
          );
          setValue(
            "about_page_heritage_description_two_en",
            res?.about_us?.heritage_description_two?.en || ""
          );
          setValue(
            "about_page_heritage_description_two_ar",
            res?.about_us?.heritage_description_two?.ar || ""
          );

          // Add team section - Bilingual
          setValue(
            "about_page_team_title_en",
            res?.about_us?.team_title?.en || ""
          );
          setValue(
            "about_page_team_title_ar",
            res?.about_us?.team_title?.ar || ""
          );
          setValue(
            "about_page_team_description_en",
            res?.about_us?.team_description?.en || ""
          );
          setValue(
            "about_page_team_description_ar",
            res?.about_us?.team_description?.ar || ""
          );
          setValue(
            "about_page_leadership_title_en",
            res?.about_us?.leadership_title?.en || ""
          );
          setValue(
            "about_page_leadership_title_ar",
            res?.about_us?.leadership_title?.ar || ""
          );
          setValue(
            "about_page_leadership_subtitle_en",
            res?.about_us?.leadership_subtitle?.en || ""
          );
          setValue(
            "about_page_leadership_subtitle_ar",
            res?.about_us?.leadership_subtitle?.ar || ""
          );

          // Add values section - Bilingual
          setValue(
            "about_page_values_title_en",
            res?.about_us?.values_title?.en || ""
          );
          setValue(
            "about_page_values_title_ar",
            res?.about_us?.values_title?.ar || ""
          );
          setValue(
            "about_page_values_description_en",
            res?.about_us?.values_description?.en || ""
          );
          setValue(
            "about_page_values_description_ar",
            res?.about_us?.values_description?.ar || ""
          );

          // Add individual values
          // Add individual values - Bilingual
          setValue(
            "about_page_value_one_title_en",
            res?.about_us?.value_one_title?.en || ""
          );
          setValue(
            "about_page_value_one_title_ar",
            res?.about_us?.value_one_title?.ar || ""
          );
          setValue(
            "about_page_value_one_description_en",
            res?.about_us?.value_one_description?.en || ""
          );
          setValue(
            "about_page_value_one_description_ar",
            res?.about_us?.value_one_description?.ar || ""
          );
          setValue(
            "about_page_value_two_title_en",
            res?.about_us?.value_two_title?.en || ""
          );
          setValue(
            "about_page_value_two_title_ar",
            res?.about_us?.value_two_title?.ar || ""
          );
          setValue(
            "about_page_value_two_description_en",
            res?.about_us?.value_two_description?.en || ""
          );
          setValue(
            "about_page_value_two_description_ar",
            res?.about_us?.value_two_description?.ar || ""
          );
          setValue(
            "about_page_value_three_title_en",
            res?.about_us?.value_three_title?.en || ""
          );
          setValue(
            "about_page_value_three_title_ar",
            res?.about_us?.value_three_title?.ar || ""
          );
          setValue(
            "about_page_value_three_description_en",
            res?.about_us?.value_three_description?.en || ""
          );
          setValue(
            "about_page_value_three_description_ar",
            res?.about_us?.value_three_description?.ar || ""
          );
          setValue(
            "about_page_value_four_title_en",
            res?.about_us?.value_four_title?.en || ""
          );
          setValue(
            "about_page_value_four_title_ar",
            res?.about_us?.value_four_title?.ar || ""
          );
          setValue(
            "about_page_value_four_description_en",
            res?.about_us?.value_four_description?.en || ""
          );
          setValue(
            "about_page_value_four_description_ar",
            res?.about_us?.value_four_description?.ar || ""
          );

          // Add branches section - Bilingual
          setValue(
            "about_page_branches_title_en",
            res?.about_us?.branches_title?.en || ""
          );
          setValue(
            "about_page_branches_title_ar",
            res?.about_us?.branches_title?.ar || ""
          );
          setValue(
            "about_page_branches_description_en",
            res?.about_us?.branches_description?.en || ""
          );
          setValue(
            "about_page_branches_description_ar",
            res?.about_us?.branches_description?.ar || ""
          );
          setValue(
            "about_page_branches_cta_title_en",
            res?.about_us?.branches_cta_title?.en || ""
          );
          setValue(
            "about_page_branches_cta_title_ar",
            res?.about_us?.branches_cta_title?.ar || ""
          );
          setValue(
            "about_page_branches_cta_description_en",
            res?.about_us?.branches_cta_description?.en || ""
          );
          setValue(
            "about_page_branches_cta_description_ar",
            res?.about_us?.branches_cta_description?.ar || ""
          );

          // Add upcoming branches - Bilingual
          setValue(
            "about_page_upcoming_branches_title_en",
            res?.about_us?.upcoming_branches_title?.en || ""
          );
          setValue(
            "about_page_upcoming_branches_title_ar",
            res?.about_us?.upcoming_branches_title?.ar || ""
          );
          
          // Upcoming Branch One - Bilingual
          setValue(
            "about_page_upcoming_branch_one_name_en",
            res?.about_us?.upcoming_branch_one_name?.en || ""
          );
          setValue(
            "about_page_upcoming_branch_one_name_ar",
            res?.about_us?.upcoming_branch_one_name?.ar || ""
          );
          setValue(
            "about_page_upcoming_branch_one_address_en",
            res?.about_us?.upcoming_branch_one_address?.en || ""
          );
          setValue(
            "about_page_upcoming_branch_one_address_ar",
            res?.about_us?.upcoming_branch_one_address?.ar || ""
          );
          setValue(
            "about_page_upcoming_branch_one_quarter_en",
            res?.about_us?.upcoming_branch_one_quarter?.en || ""
          );
          setValue(
            "about_page_upcoming_branch_one_quarter_ar",
            res?.about_us?.upcoming_branch_one_quarter?.ar || ""
          );
          setValue(
            "about_page_upcoming_branch_one_features_en",
            res?.about_us?.upcoming_branch_one_features?.en || ""
          );
          setValue(
            "about_page_upcoming_branch_one_features_ar",
            res?.about_us?.upcoming_branch_one_features?.ar || ""
          );
          setValue(
            "about_page_upcoming_branch_one_emoji_en",
            res?.about_us?.upcoming_branch_one_emoji?.en || ""
          );
          setValue(
            "about_page_upcoming_branch_one_emoji_ar",
            res?.about_us?.upcoming_branch_one_emoji?.ar || ""
          );
          
          // Upcoming Branch Two - Bilingual
          setValue(
            "about_page_upcoming_branch_two_name_en",
            res?.about_us?.upcoming_branch_two_name?.en || ""
          );
          setValue(
            "about_page_upcoming_branch_two_name_ar",
            res?.about_us?.upcoming_branch_two_name?.ar || ""
          );
          setValue(
            "about_page_upcoming_branch_two_address_en",
            res?.about_us?.upcoming_branch_two_address?.en || ""
          );
          setValue(
            "about_page_upcoming_branch_two_address_ar",
            res?.about_us?.upcoming_branch_two_address?.ar || ""
          );
          setValue(
            "about_page_upcoming_branch_two_quarter_en",
            res?.about_us?.upcoming_branch_two_quarter?.en || ""
          );
          setValue(
            "about_page_upcoming_branch_two_quarter_ar",
            res?.about_us?.upcoming_branch_two_quarter?.ar || ""
          );
          setValue(
            "about_page_upcoming_branch_two_features_en",
            res?.about_us?.upcoming_branch_two_features?.en || ""
          );
          setValue(
            "about_page_upcoming_branch_two_features_ar",
            res?.about_us?.upcoming_branch_two_features?.ar || ""
          );
          setValue(
            "about_page_upcoming_branch_two_emoji_en",
            res?.about_us?.upcoming_branch_two_emoji?.en || ""
          );
          setValue(
            "about_page_upcoming_branch_two_emoji_ar",
            res?.about_us?.upcoming_branch_two_emoji?.ar || ""
          );
          
          // Current Branches 1-8 - Bilingual
          // Branch One
          setValue(
            "about_page_branch_one_name_en",
            res?.about_us?.branch_one_name?.en || ""
          );
          setValue(
            "about_page_branch_one_name_ar",
            res?.about_us?.branch_one_name?.ar || ""
          );
          setValue(
            "about_page_branch_one_address_en",
            res?.about_us?.branch_one_address?.en || ""
          );
          setValue(
            "about_page_branch_one_address_ar",
            res?.about_us?.branch_one_address?.ar || ""
          );
          setValue(
            "about_page_branch_one_phone_en",
            res?.about_us?.branch_one_phone?.en || ""
          );
          setValue(
            "about_page_branch_one_phone_ar",
            res?.about_us?.branch_one_phone?.ar || ""
          );
          setValue(
            "about_page_branch_one_hours_en",
            res?.about_us?.branch_one_hours?.en || ""
          );
          setValue(
            "about_page_branch_one_hours_ar",
            res?.about_us?.branch_one_hours?.ar || ""
          );
          setValue(
            "about_page_branch_one_subtitle_en",
            res?.about_us?.branch_one_subtitle?.en || ""
          );
          setValue(
            "about_page_branch_one_subtitle_ar",
            res?.about_us?.branch_one_subtitle?.ar || ""
          );
          setValue(
            "about_page_branch_one_services_en",
            res?.about_us?.branch_one_services?.en || ""
          );
          setValue(
            "about_page_branch_one_services_ar",
            res?.about_us?.branch_one_services?.ar || ""
          );
          setValue(
            "about_page_branch_one_directions_en",
            res?.about_us?.branch_one_directions?.en || ""
          );
          setValue(
            "about_page_branch_one_directions_ar",
            res?.about_us?.branch_one_directions?.ar || ""
          );
          
          // Branch Two
          setValue(
            "about_page_branch_two_name_en",
            res?.about_us?.branch_two_name?.en || ""
          );
          setValue(
            "about_page_branch_two_name_ar",
            res?.about_us?.branch_two_name?.ar || ""
          );
          setValue(
            "about_page_branch_two_address_en",
            res?.about_us?.branch_two_address?.en || ""
          );
          setValue(
            "about_page_branch_two_address_ar",
            res?.about_us?.branch_two_address?.ar || ""
          );
          setValue(
            "about_page_branch_two_phone_en",
            res?.about_us?.branch_two_phone?.en || ""
          );
          setValue(
            "about_page_branch_two_phone_ar",
            res?.about_us?.branch_two_phone?.ar || ""
          );
          setValue(
            "about_page_branch_two_hours_en",
            res?.about_us?.branch_two_hours?.en || ""
          );
          setValue(
            "about_page_branch_two_hours_ar",
            res?.about_us?.branch_two_hours?.ar || ""
          );
          setValue(
            "about_page_branch_two_subtitle_en",
            res?.about_us?.branch_two_subtitle?.en || ""
          );
          setValue(
            "about_page_branch_two_subtitle_ar",
            res?.about_us?.branch_two_subtitle?.ar || ""
          );
          setValue(
            "about_page_branch_two_services_en",
            res?.about_us?.branch_two_services?.en || ""
          );
          setValue(
            "about_page_branch_two_services_ar",
            res?.about_us?.branch_two_services?.ar || ""
          );
          setValue(
            "about_page_branch_two_directions_en",
            res?.about_us?.branch_two_directions?.en || ""
          );
          setValue(
            "about_page_branch_two_directions_ar",
            res?.about_us?.branch_two_directions?.ar || ""
          );
          
          // Branches Three through Eight - Bilingual
          const remainingBranchWords = ['three', 'four', 'five', 'six', 'seven', 'eight'];
          remainingBranchWords.forEach(branchWord => {
            const branchNum = remainingBranchWords.indexOf(branchWord) + 3;
            setValue(
              `about_page_branch_${branchWord}_name_en`,
              res?.about_us?.[`branch_${branchWord}_name`]?.en || ""
            );
            setValue(
              `about_page_branch_${branchWord}_name_ar`,
              res?.about_us?.[`branch_${branchWord}_name`]?.ar || ""
            );
            setValue(
              `about_page_branch_${branchWord}_address_en`,
              res?.about_us?.[`branch_${branchWord}_address`]?.en || ""
            );
            setValue(
              `about_page_branch_${branchWord}_address_ar`,
              res?.about_us?.[`branch_${branchWord}_address`]?.ar || ""
            );
            setValue(
              `about_page_branch_${branchWord}_phone_en`,
              res?.about_us?.[`branch_${branchWord}_phone`]?.en || ""
            );
            setValue(
              `about_page_branch_${branchWord}_phone_ar`,
              res?.about_us?.[`branch_${branchWord}_phone`]?.ar || ""
            );
            setValue(
              `about_page_branch_${branchWord}_hours_en`,
              res?.about_us?.[`branch_${branchWord}_hours`]?.en || ""
            );
            setValue(
              `about_page_branch_${branchWord}_hours_ar`,
              res?.about_us?.[`branch_${branchWord}_hours`]?.ar || ""
            );
            setValue(
              `about_page_branch_${branchWord}_subtitle_en`,
              res?.about_us?.[`branch_${branchWord}_subtitle`]?.en || ""
            );
            setValue(
              `about_page_branch_${branchWord}_subtitle_ar`,
              res?.about_us?.[`branch_${branchWord}_subtitle`]?.ar || ""
            );
            setValue(
              `about_page_branch_${branchWord}_services_en`,
              res?.about_us?.[`branch_${branchWord}_services`]?.en || ""
            );
            setValue(
              `about_page_branch_${branchWord}_services_ar`,
              res?.about_us?.[`branch_${branchWord}_services`]?.ar || ""
            );
            setValue(
              `about_page_branch_${branchWord}_directions_en`,
              res?.about_us?.[`branch_${branchWord}_directions`]?.en || ""
            );
            setValue(
              `about_page_branch_${branchWord}_directions_ar`,
              res?.about_us?.[`branch_${branchWord}_directions`]?.ar || ""
            );
          });

          //contact us
          setContactPageHeader(res?.contact_us?.header_status);
          setContactHeaderBg(res?.contact_us?.header_bg);
          setEmailUsBox(res?.contact_us?.email_box_status);
          setCallUsBox(res?.contact_us?.call_box_status);
          setAddressBox(res?.contact_us?.address_box_status);
          setContactMidLeftColStatus(res?.contact_us?.left_col_status);
          setContactMidLeftColImage(res?.contact_us?.left_col_img);
          setContactFormStatus(res?.contact_us?.form_status);
          setValue(
            "contact_page_title",
            res?.contact_us?.title[language || "en"]
          );
          setValue(
            "contact_page_email_box_title",
            res?.contact_us?.email_box_title[language || "en"]
          );
          setValue(
            "contact_page_email_box_email",
            res?.contact_us?.email_box_email[language || "en"]
          );
          setValue(
            "contact_page_email_box_text",
            res?.contact_us?.email_box_text[language || "en"]
          );
          setValue(
            "contact_page_callUs_box_title",
            res?.contact_us?.call_box_title[language || "en"]
          );
          setValue(
            "contact_page_callUs_box_phone",
            res?.contact_us?.call_box_phone[language || "en"]
          );
          setValue(
            "contact_page_callUs_box_text",
            res?.contact_us?.call_box_text[language || "en"]
          );
          setValue(
            "contact_page_address_box_title",
            res?.contact_us?.address_box_title[language || "en"]
          );
          setValue(
            "contact_page_address_box_address_one",
            res?.contact_us?.address_box_address_one[language || "en"]
          );
          setValue(
            "contact_page_address_box_address_two",
            res?.contact_us?.address_box_address_two[language || "en"]
          );
          setValue(
            "contact_page_address_box_address_three",
            res?.contact_us?.address_box_address_three[language || "en"]
          );
          setValue(
            "contact_page_form_title",
            res?.contact_us?.form_title[language || "en"]
          );
          setValue(
            "contact_page_form_description",
            res?.contact_us?.form_description[language || "en"]
          );

          // Set Arabic values for contact us fields
          setValue(
            "contact_page_title_ar",
            res?.contact_us?.title?.ar || ""
          );
          setValue(
            "contact_page_email_box_title_ar",
            res?.contact_us?.email_box_title?.ar || ""
          );
          setValue(
            "contact_page_email_box_email_ar",
            res?.contact_us?.email_box_email?.ar || ""
          );
          setValue(
            "contact_page_email_box_text_ar",
            res?.contact_us?.email_box_text?.ar || ""
          );
          setValue(
            "contact_page_callUs_box_title_ar",
            res?.contact_us?.call_box_title?.ar || ""
          );
          setValue(
            "contact_page_callUs_box_phone_ar",
            res?.contact_us?.call_box_phone?.ar || ""
          );
          setValue(
            "contact_page_callUs_box_text_ar",
            res?.contact_us?.call_box_text?.ar || ""
          );
          setValue(
            "contact_page_address_box_title_ar",
            res?.contact_us?.address_box_title?.ar || ""
          );
          setValue(
            "contact_page_address_box_address_one_ar",
            res?.contact_us?.address_box_address_one?.ar || ""
          );
          setValue(
            "contact_page_address_box_address_two_ar",
            res?.contact_us?.address_box_address_two?.ar || ""
          );
          setValue(
            "contact_page_address_box_address_three_ar",
            res?.contact_us?.address_box_address_three?.ar || ""
          );
          setValue(
            "contact_page_form_title_ar",
            res?.contact_us?.form_title?.ar || ""
          );
          setValue(
            "contact_page_form_description_ar",
            res?.contact_us?.form_description?.ar || ""
          );

          //privacy policy
          setPrivacyPolicy(res?.privacy_policy?.status);
          setPrivacyPolicyHeaderBg(res?.privacy_policy?.header_bg);
          setValue(
            "privacy_page_title",
            res?.privacy_policy?.title[language || "en"]
          );

          setTextEdit(
            createEditorState(
              showingTranslateValue(res?.privacy_policy?.description)
            )
          );

          // NEW: populate additional Privacy Policy fields so they persist after refresh
          setValue(
            "pp_effective_date",
            res?.privacy_policy?.effective_date || ""
          );
          setValue(
            "pp_last_updated",
            res?.privacy_policy?.last_updated || ""
          );
          setValue(
            "pp_tagline",
            res?.privacy_policy?.tagline ? res?.privacy_policy?.tagline[language || "en"] : ""
          );
          // CTA fields
          setValue(
            "pp_cta_title",
            res?.privacy_policy?.cta_title ? res?.privacy_policy?.cta_title[language || "en"] : ""
          );
          setValue(
            "pp_cta_desc",
            res?.privacy_policy?.cta_desc ? res?.privacy_policy?.cta_desc[language || "en"] : ""
          );
          setValue(
            "pp_cta_btn_text",
            res?.privacy_policy?.cta_btn_text ? res?.privacy_policy?.cta_btn_text[language || "en"] : ""
          );
          setValue(
            "pp_cta_btn_link",
            res?.privacy_policy?.cta_btn_link || ""
          );
          // Dynamic Privacy Policy Sections (1-12)
          const ppSectionWords = [
            "one",
            "two",
            "three",
            "four",
            "five",
            "six",
            "seven",
            "eight",
            "nine",
            "ten",
            "eleven",
            "twelve",
          ];
          ppSectionWords.forEach((word, idx) => {
            setValue(
              `pp_section_${idx + 1}_title`,
              res?.privacy_policy?.[`section_${word}_title`]
                ? res?.privacy_policy?.[`section_${word}_title`][language || "en"]
                : ""
            );
            setValue(
              `pp_section_${idx + 1}_body`,
              res?.privacy_policy?.[`section_${word}_body`]
                ? res?.privacy_policy?.[`section_${word}_body`][language || "en"]
                : ""
            );
          });
          
          // Privacy Policy Rights Section Title and Description
          setValue(
            "rights_title",
            res?.privacy_policy?.rights_title ? res?.privacy_policy?.rights_title[language || "en"] : ""
          );
          setValue(
            "rights_desc",
            res?.privacy_policy?.rights_desc ? res?.privacy_policy?.rights_desc[language || "en"] : ""
          );
          
          // Privacy Policy Rights Boxes (1-6)
          for (let i = 1; i <= 6; i++) {
            setValue(
              `pp_right_${i}_name`,
              res?.privacy_policy?.[`right_${i}_name`]
                ? res?.privacy_policy?.[`right_${i}_name`][language || "en"]
                : ""
            );
            setValue(
              `pp_right_${i}_desc`,
              res?.privacy_policy?.[`right_${i}_desc`]
                ? res?.privacy_policy?.[`right_${i}_desc`][language || "en"]
                : ""
            );
            setValue(
              `pp_right_${i}_emoji`,
              res?.privacy_policy?.[`right_${i}_emoji`] || ""
            );
          }

          //term and condition
          setTermsConditions(res?.term_and_condition?.status);
          setTermsConditionsHeaderBg(res?.term_and_condition?.header_bg);
          setValue(
            "termsConditions_page_title",
            res?.term_and_condition?.title[language || "en"]
          );

          setTermsConditionsTextEdit(
            createEditorState(
              showingTranslateValue(res?.term_and_condition?.description)
            )
          );

          // NEW: populate additional Terms & Conditions fields
          setValue(
            "tc_effective_date",
            res?.term_and_condition?.effective_date || ""
          );
          setValue(
            "tc_last_updated",
            res?.term_and_condition?.last_updated || ""
          );
          // CTA fields
          setValue(
            "tc_cta_title",
            res?.term_and_condition?.cta_title ? res?.term_and_condition?.cta_title[language || "en"] : ""
          );
          setValue(
            "tc_cta_desc",
            res?.term_and_condition?.cta_desc ? res?.term_and_condition?.cta_desc[language || "en"] : ""
          );
          setValue(
            "tc_cta_btn_text",
            res?.term_and_condition?.cta_btn_text ? res?.term_and_condition?.cta_btn_text[language || "en"] : ""
          );
          setValue(
            "tc_cta_btn_link",
            res?.term_and_condition?.cta_btn_link || ""
          );
          // Dynamic Terms & Conditions Sections (1-15)
          const tcSectionWords = [
            "one",
            "two",
            "three",
            "four",
            "five",
            "six",
            "seven",
            "eight",
            "nine",
            "ten",
            "eleven",
            "twelve",
            "thirteen",
            "fourteen",
            "fifteen",
          ];
          tcSectionWords.forEach((word, idx) => {
            setValue(
              `tc_section_${idx + 1}_title`,
              res?.term_and_condition?.[`section_${word}_title`]
                ? res?.term_and_condition?.[`section_${word}_title`][language || "en"]
                : ""
            );
            setValue(
              `tc_section_${idx + 1}_body`,
              res?.term_and_condition?.[`section_${word}_body`]
                ? res?.term_and_condition?.[`section_${word}_body`][language || "en"]
                : ""
            );
          });

          //faq
          setFaqStatus(res?.faq?.page_status);
          setFaqHeaderBg(res?.faq?.header_bg);
          setFaqLeftColImage(res?.faq?.left_img);
          setFaqLeftColStatus(res?.faq?.leftcol_status);
          setFaqRightColStatus(res?.faq?.rightcol_status);
          setValue("faq_page_title", res?.faq?.title[language || "en"]);
          setValue("faq_title_one", res?.faq?.faq_one[language || "en"]);
          setValue(
            "faq_description_one",
            res?.faq?.description_one[language || "en"]
          );
          setValue("faq_title_two", res?.faq?.faq_two[language || "en"]);
          setValue(
            "faq_description_two",
            res?.faq?.description_two[language || "en"]
          );
          setValue("faq_title_three", res?.faq?.faq_three[language || "en"]);
          setValue(
            "faq_description_three",
            res?.faq?.description_three[language || "en"]
          );
          setValue("faq_title_four", res?.faq?.faq_four[language || "en"]);
          setValue(
            "faq_description_four",
            res?.faq?.description_four[language || "en"]
          );
          setValue("faq_title_five", res?.faq?.faq_five[language || "en"]);
          setValue(
            "faq_description_five",
            res?.faq?.description_five[language || "en"]
          );
          setValue("faq_title_six", res?.faq?.faq_six[language || "en"]);
          setValue(
            "faq_description_six",
            res?.faq?.description_six[language || "en"]
          );
          setValue("faq_title_seven", res?.faq?.faq_seven[language || "en"]);
          setValue(
            "faq_description_seven",
            res?.faq?.description_seven[language || "en"]
          );
          setValue("faq_title_eight", res?.faq?.faq_eight[language || "en"]);
          setValue(
            "faq_description_eight",
            res?.faq?.description_eight[language || "en"]
          );

          //offers
          setOffersPageHeader(res?.offers?.header_status);
          setOffersHeaderBg(res?.offers?.header_bg);

          setValue("offers_page_title", res?.offers?.title[language || "en"]);
          // setValue('offers_coupon_code', res.offers_coupon_code);
          // setCouponList1(res?.offers?.coupon_code);
          const coupon_code = res?.offers?.coupon_code?.map((coupon) => {
            const newObj = {
              label: coupon,
              value: coupon,
            };
            return newObj;
          });
          setCouponList1(coupon_code || []);
          const resCoupon = await CouponServices.getAllCoupons();
          const result = resCoupon?.map((coupon) => {
            const newObj = {
              label: coupon?.couponCode,
              value: coupon?.couponCode,
            };
            return newObj;
          });
          setCoupons(result);

          //for seo
          setMetaImg(res.seo.meta_img);
          setFavicon(res.seo.favicon);
          setValue("meta_title", res.seo.meta_title);
          setValue("meta_description", res.seo.meta_description);
          setValue("meta_keywords", res.seo.meta_keywords);
          setValue("meta_url", res.seo.meta_url);

          // Core Values
          setValue(
            "about_page_values_title",
            res?.about_us?.values_title ? res?.about_us?.values_title[language || "en"] : ""
          );
          setValue(
            "about_page_values_description_en",
            res?.about_us?.values_description ? res?.about_us?.values_description.en || "" : ""
          );
          setValue(
            "about_page_values_description_ar",
            res?.about_us?.values_description ? res?.about_us?.values_description.ar || "" : ""
          );

          // Heritage Section
          setValue(
            "about_page_heritage_title",
            res?.about_us?.heritage_title ? res?.about_us?.heritage_title[language || "en"] : ""
          );
          setValue(
            "about_page_heritage_description_one",
            res?.about_us?.heritage_description_one ? res?.about_us?.heritage_description_one[language || "en"] : ""
          );
          setValue(
            "about_page_heritage_description_two",
            res?.about_us?.heritage_description_two ? res?.about_us?.heritage_description_two[language || "en"] : ""
          );

          // Team Section
          setValue(
            "about_page_team_title",
            res?.about_us?.team_title ? res?.about_us?.team_title[language || "en"] : ""
          );
          setValue(
            "about_page_team_description",
            res?.about_us?.team_description ? res?.about_us?.team_description[language || "en"] : ""
          );
          setValue(
            "about_page_leadership_title",
            res?.about_us?.leadership_title ? res?.about_us?.leadership_title[language || "en"] : ""
          );
          setValue(
            "about_page_leadership_subtitle",
            res?.about_us?.leadership_subtitle ? res?.about_us?.leadership_subtitle[language || "en"] : ""
          );

          // Core Values - Bilingual
          setValue(
            "about_page_value_one_title_en",
            res?.about_us?.value_one_title ? res?.about_us?.value_one_title.en || "" : ""
          );
          setValue(
            "about_page_value_one_title_ar",
            res?.about_us?.value_one_title ? res?.about_us?.value_one_title.ar || "" : ""
          );
          setValue(
            "about_page_value_one_description_en",
            res?.about_us?.value_one_description ? res?.about_us?.value_one_description.en || "" : ""
          );
          setValue(
            "about_page_value_one_description_ar",
            res?.about_us?.value_one_description ? res?.about_us?.value_one_description.ar || "" : ""
          );
          setValue(
            "about_page_value_two_title_en",
            res?.about_us?.value_two_title ? res?.about_us?.value_two_title.en || "" : ""
          );
          setValue(
            "about_page_value_two_title_ar",
            res?.about_us?.value_two_title ? res?.about_us?.value_two_title.ar || "" : ""
          );
          setValue(
            "about_page_value_two_description_en",
            res?.about_us?.value_two_description ? res?.about_us?.value_two_description.en || "" : ""
          );
          setValue(
            "about_page_value_two_description_ar",
            res?.about_us?.value_two_description ? res?.about_us?.value_two_description.ar || "" : ""
          );
          setValue(
            "about_page_value_three_title_en",
            res?.about_us?.value_three_title ? res?.about_us?.value_three_title.en || "" : ""
          );
          setValue(
            "about_page_value_three_title_ar",
            res?.about_us?.value_three_title ? res?.about_us?.value_three_title.ar || "" : ""
          );
          setValue(
            "about_page_value_three_description_en",
            res?.about_us?.value_three_description ? res?.about_us?.value_three_description.en || "" : ""
          );
          setValue(
            "about_page_value_three_description_ar",
            res?.about_us?.value_three_description ? res?.about_us?.value_three_description.ar || "" : ""
          );
          setValue(
            "about_page_value_four_title_en",
            res?.about_us?.value_four_title ? res?.about_us?.value_four_title.en || "" : ""
          );
          setValue(
            "about_page_value_four_title_ar",
            res?.about_us?.value_four_title ? res?.about_us?.value_four_title.ar || "" : ""
          );
          setValue(
            "about_page_value_four_description_en",
            res?.about_us?.value_four_description ? res?.about_us?.value_four_description.en || "" : ""
          );
          setValue(
            "about_page_value_four_description_ar",
            res?.about_us?.value_four_description ? res?.about_us?.value_four_description.ar || "" : ""
          );

          // Team Members
          setValue(
            "about_page_founder_one_name",
            res?.about_us?.founder_one_name ? res?.about_us?.founder_one_name[language || "en"] : ""
          );
          setValue(
            "about_page_founder_one_position",
            res?.about_us?.founder_one_position ? res?.about_us?.founder_one_position[language || "en"] : ""
          );
          setValue(
            "about_page_founder_two_name",
            res?.about_us?.founder_two_name ? res?.about_us?.founder_two_name[language || "en"] : ""
          );
          setValue(
            "about_page_founder_two_position",
            res?.about_us?.founder_two_position ? res?.about_us?.founder_two_position[language || "en"] : ""
          );
          setValue(
            "about_page_founder_three_name",
            res?.about_us?.founder_three_name ? res?.about_us?.founder_three_name[language || "en"] : ""
          );
          setValue(
            "about_page_founder_three_position",
            res?.about_us?.founder_three_position ? res?.about_us?.founder_three_position[language || "en"] : ""
          );
          setValue(
            "about_page_founder_four_name",
            res?.about_us?.founder_four_name ? res?.about_us?.founder_four_name[language || "en"] : ""
          );
          setValue(
            "about_page_founder_four_position",
            res?.about_us?.founder_four_position ? res?.about_us?.founder_four_position[language || "en"] : ""
          );
          setValue(
            "about_page_founder_five_name",
            res?.about_us?.founder_five_name ? res?.about_us?.founder_five_name[language || "en"] : ""
          );
          setValue(
            "about_page_founder_five_position",
            res?.about_us?.founder_five_position ? res?.about_us?.founder_five_position[language || "en"] : ""
          );
          setValue(
            "about_page_founder_six_name",
            res?.about_us?.founder_six_name ? res?.about_us?.founder_six_name[language || "en"] : ""
          );
          setValue(
            "about_page_founder_six_position",
            res?.about_us?.founder_six_position ? res?.about_us?.founder_six_position[language || "en"] : ""
          );
          setValue(
            "about_page_founder_seven_name",
            res?.about_us?.founder_seven_name ? res?.about_us?.founder_seven_name[language || "en"] : ""
          );
          setValue(
            "about_page_founder_seven_position",
            res?.about_us?.founder_seven_position ? res?.about_us?.founder_seven_position[language || "en"] : ""
          );
          setValue(
            "about_page_founder_eight_name",
            res?.about_us?.founder_eight_name ? res?.about_us?.founder_eight_name[language || "en"] : ""
          );
          setValue(
            "about_page_founder_eight_position",
            res?.about_us?.founder_eight_position ? res?.about_us?.founder_eight_position[language || "en"] : ""
          );
          setValue(
            "about_page_founder_nine_name",
            res?.about_us?.founder_nine_name ? res?.about_us?.founder_nine_name[language || "en"] : ""
          );
          setValue(
            "about_page_founder_nine_position",
            res?.about_us?.founder_nine_position ? res?.about_us?.founder_nine_position[language || "en"] : ""
          );
          setValue(
            "about_page_founder_ten_name",
            res?.about_us?.founder_ten_name ? res?.about_us?.founder_ten_name[language || "en"] : ""
          );
          setValue(
            "about_page_founder_ten_position",
            res?.about_us?.founder_ten_position ? res?.about_us?.founder_ten_position[language || "en"] : ""
          );
          setValue(
            "about_page_founder_eleven_name",
            res?.about_us?.founder_eleven_name ? res?.about_us?.founder_eleven_name[language || "en"] : ""
          );
          setValue(
            "about_page_founder_eleven_position",
            res?.about_us?.founder_eleven_position ? res?.about_us?.founder_eleven_position[language || "en"] : ""
          );
          setValue(
            "about_page_founder_twelve_name",
            res?.about_us?.founder_twelve_name ? res?.about_us?.founder_twelve_name[language || "en"] : ""
          );
          setValue(
            "about_page_founder_twelve_position",
            res?.about_us?.founder_twelve_position ? res?.about_us?.founder_twelve_position[language || "en"] : ""
          );

          // Branches
          setValue(
            "about_page_branches_title",
            res?.about_us?.branches_title ? res?.about_us?.branches_title[language || "en"] : ""
          );
          setValue(
            "about_page_branches_description_en",
            res?.about_us?.branches_description ? res?.about_us?.branches_description.en || "" : ""
          );
          setValue(
            "about_page_branches_description_ar",
            res?.about_us?.branches_description ? res?.about_us?.branches_description.ar || "" : ""
          );
          setValue(
            "about_page_branches_cta_title_en",
            res?.about_us?.branches_cta_title ? res?.about_us?.branches_cta_title.en || "" : ""
          );
          setValue(
            "about_page_branches_cta_title_ar",
            res?.about_us?.branches_cta_title ? res?.about_us?.branches_cta_title.ar || "" : ""
          );
            setValue(
            "about_page_branches_cta_description_en",
            res?.about_us?.branches_cta_description ? res?.about_us?.branches_cta_description.en || "" : ""
            );
            setValue(
            "about_page_branches_cta_description_ar",
            res?.about_us?.branches_cta_description ? res?.about_us?.branches_cta_description.ar || "" : ""
            );
            setValue(
            "about_page_upcoming_branches_title_en",
            res?.about_us?.upcoming_branches_title ? res?.about_us?.upcoming_branches_title.en || "" : ""
            );
            setValue(
            "about_page_upcoming_branches_title_ar",
            res?.about_us?.upcoming_branches_title ? res?.about_us?.upcoming_branches_title.ar || "" : ""
          );

          // Branch Data
          const branchWords = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight'];
          branchWords.forEach((branchWord) => {
            setValue(
              `about_page_branch_${branchWord}_name`,
              res?.about_us?.[`branch_${branchWord}_name`] ? res?.about_us?.[`branch_${branchWord}_name`][language || "en"] : ""
            );
            setValue(
              `about_page_branch_${branchWord}_address`,
              res?.about_us?.[`branch_${branchWord}_address`] ? res?.about_us?.[`branch_${branchWord}_address`][language || "en"] : ""
            );
            setValue(
              `about_page_branch_${branchWord}_phone`,
              res?.about_us?.[`branch_${branchWord}_phone`] ? res?.about_us?.[`branch_${branchWord}_phone`][language || "en"] : ""
            );
            setValue(
              `about_page_branch_${branchWord}_hours`,
              res?.about_us?.[`branch_${branchWord}_hours`] ? res?.about_us?.[`branch_${branchWord}_hours`][language || "en"] : ""
            );
            // NEW: subtitle/type, services and directions link
            setValue(
              `about_page_branch_${branchWord}_subtitle`,
              res?.about_us?.[`branch_${branchWord}_subtitle`] ? res?.about_us?.[`branch_${branchWord}_subtitle`][language || "en"] : ""
            );
            setValue(
              `about_page_branch_${branchWord}_services`,
              res?.about_us?.[`branch_${branchWord}_services`] ? res?.about_us?.[`branch_${branchWord}_services`][language || "en"] : ""
            );
            setValue(
              `about_page_branch_${branchWord}_directions`,
              res?.about_us?.[`branch_${branchWord}_directions`] ? res?.about_us?.[`branch_${branchWord}_directions`][language || "en"] : ""
            );
          });

          // Initialize section toggles based on data presence
          if (res?.about_us?.values_title || res?.about_us?.value_one_title || res?.about_us?.value_two_title) {
            setAboutCoreValues(true);
          }
          
          if (res?.about_us?.branches_title || res?.about_us?.branch_one_name || res?.about_us?.upcoming_branches_title) {
            setAboutBranches(true);
          }

          // Upcoming Branches (static two) - Bilingual
          setValue(
            "about_page_upcoming_branch_one_name_en",
            res?.about_us?.upcoming_branch_one_name ? res?.about_us?.upcoming_branch_one_name.en || "" : ""
          );
          setValue(
            "about_page_upcoming_branch_one_name_ar",
            res?.about_us?.upcoming_branch_one_name ? res?.about_us?.upcoming_branch_one_name.ar || "" : ""
          );
          setValue(
            "about_page_upcoming_branch_one_address_en",
            res?.about_us?.upcoming_branch_one_address ? res?.about_us?.upcoming_branch_one_address.en || "" : ""
          );
          setValue(
            "about_page_upcoming_branch_one_address_ar",
            res?.about_us?.upcoming_branch_one_address ? res?.about_us?.upcoming_branch_one_address.ar || "" : ""
          );
          setValue(
            "about_page_upcoming_branch_two_name_en",
            res?.about_us?.upcoming_branch_two_name ? res?.about_us?.upcoming_branch_two_name.en || "" : ""
          );
          setValue(
            "about_page_upcoming_branch_two_name_ar",
            res?.about_us?.upcoming_branch_two_name ? res?.about_us?.upcoming_branch_two_name.ar || "" : ""
          );
          setValue(
            "about_page_upcoming_branch_two_address_en",
            res?.about_us?.upcoming_branch_two_address ? res?.about_us?.upcoming_branch_two_address.en || "" : ""
          );
          setValue(
            "about_page_upcoming_branch_two_address_ar",
            res?.about_us?.upcoming_branch_two_address ? res?.about_us?.upcoming_branch_two_address.ar || "" : ""
          );

          setValue(
            "about_page_upcoming_branch_one_quarter_en",
            res?.about_us?.upcoming_branch_one_quarter ? res?.about_us?.upcoming_branch_one_quarter.en || "" : ""
          );
          setValue(
            "about_page_upcoming_branch_one_quarter_ar",
            res?.about_us?.upcoming_branch_one_quarter ? res?.about_us?.upcoming_branch_one_quarter.ar || "" : ""
          );
          setValue(
            "about_page_upcoming_branch_one_features_en",
            res?.about_us?.upcoming_branch_one_features ? res?.about_us?.upcoming_branch_one_features.en || "" : ""
          );
          setValue(
            "about_page_upcoming_branch_one_features_ar",
            res?.about_us?.upcoming_branch_one_features ? res?.about_us?.upcoming_branch_one_features.ar || "" : ""
          );
          setValue(
            "about_page_upcoming_branch_one_emoji_en",
            res?.about_us?.upcoming_branch_one_emoji ? res?.about_us?.upcoming_branch_one_emoji.en || "" : ""
          );
          setValue(
            "about_page_upcoming_branch_one_emoji_ar",
            res?.about_us?.upcoming_branch_one_emoji ? res?.about_us?.upcoming_branch_one_emoji.ar || "" : ""
          );

          setValue(
            "about_page_upcoming_branch_two_quarter_en",
            res?.about_us?.upcoming_branch_two_quarter ? res?.about_us?.upcoming_branch_two_quarter.en || "" : ""
          );
          setValue(
            "about_page_upcoming_branch_two_quarter_ar",
            res?.about_us?.upcoming_branch_two_quarter ? res?.about_us?.upcoming_branch_two_quarter.ar || "" : ""
          );
          setValue(
            "about_page_upcoming_branch_two_features_en",
            res?.about_us?.upcoming_branch_two_features ? res?.about_us?.upcoming_branch_two_features.en || "" : ""
          );
          setValue(
            "about_page_upcoming_branch_two_features_ar",
            res?.about_us?.upcoming_branch_two_features ? res?.about_us?.upcoming_branch_two_features.ar || "" : ""
          );
          setValue(
            "about_page_upcoming_branch_two_emoji_en",
            res?.about_us?.upcoming_branch_two_emoji ? res?.about_us?.upcoming_branch_two_emoji.en || "" : ""
          );
          setValue(
            "about_page_upcoming_branch_two_emoji_ar",
            res?.about_us?.upcoming_branch_two_emoji ? res?.about_us?.upcoming_branch_two_emoji.ar || "" : ""
          );

          setValue(
            "about_page_trusted_badge_one_pill",
            res?.about_us?.trusted_badge_one_pill ? res?.about_us?.trusted_badge_one_pill[language || "en"] : ""
          );
          setValue(
            "about_page_trusted_badge_one_text",
            res?.about_us?.trusted_badge_one_text ? res?.about_us?.trusted_badge_one_text[language || "en"] : ""
          );
          setValue(
            "about_page_trusted_badge_two_pill",
            res?.about_us?.trusted_badge_two_pill ? res?.about_us?.trusted_badge_two_pill[language || "en"] : ""
          );
          setValue(
            "about_page_trusted_badge_two_text",
            res?.about_us?.trusted_badge_two_text ? res?.about_us?.trusted_badge_two_text[language || "en"] : ""
          );
        }
      } catch (err) {
        notifyError(err ? err?.response?.data?.message : err?.message);
      }
    };
    getStoreCustomizationData();
    return () => {
      const controller = new AbortController();
      controller.abort();
    };
  }, [language, setValue]);

  const handleSelectLanguage = (lang) => {
    // console.log("resData", resData);
    setLanguage(lang);
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    setValue,
    control,
    errors,
    favicon,
    coupons,
    setFavicon,
    metaImg,
    setMetaImg,
    headerLogo,
    setHeaderLogo,
    sliderImage,
    setSliderImage,
    sliderImageTwo,
    setSliderImageTwo,
    sliderImageThree,
    setSliderImageThree,
    sliderImageFour,
    setSliderImageFour,
    sliderImageFive,
    setSliderImageFive,
    placeholderImage,
    setPlaceHolderImage,
    quickSectionImage,
    setQuickSectionImage,
    getYourDailyNeedImageLeft,
    setGetYourDailyNeedImageLeft,
    getYourDailyNeedImageRight,
    setGetYourDailyNeedImageRight,
    footerLogo,
    setFooterLogo,
    paymentImage,
    setPaymentImage,
    allowDiscount,
    setAllowDiscount,
    allowPromotionBanner,
    setAllowPromotionBanner,
    printSlip,
    setPrintSlip,
    orderProcess,
    setOrderProcess,
    paymentOption,
    setPaymentOption,
    isSave,
    allowOutOfStock,
    setAllowOutOfStock,
    isCoupon,
    isPlaceholder,
    isSliderFullWidth,
    setIsCoupon,
    setDiscount_coupon_status,
    discount_coupon_status,
    setIsPlaceholder,
    setIsSliderFullWidth,
    emailSlip,
    setEmailSlip,
    setPromotionBanner,
    promotionBanner,
    featuredCategories,
    setFeaturedCategories,
    popularProducts,
    setPopularProducts,
    setQuickDelivery,
    quickDelivery,
    setLatestDiscounted,
    latestDiscounted,
    setDailyNeeds,
    dailyNeeds,
    setFeaturePromo,
    featurePromo,
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
    setSingleProductPageRightBox,
    singleProductPageRightBox,
    handleSelectLanguage,
    setLeftRightArrow,
    leftRightArrow,
    setBottomDots,
    bottomDots,
    setBothSliderOption,
    bothSliderOption,
    getButton1image,
    setGetButton1image,
    getButton2image,
    setGetButton2image,
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
    setAboutPageHeader,
    aboutPageHeader,
    setAboutTopContentLeft,
    aboutTopContentLeft,
    setAboutHeaderBg,
    aboutHeaderBg,
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
    // Additional founder images
    ourFounderSevenImage,
    setOurFounderSevenImage,
    ourFounderEightImage,
    setOurFounderEightImage,
    ourFounderNineImage,
    setOurFounderNineImage,
    ourFounderTenImage,
    setOurFounderTenImage,
    ourFounderElevenImage,
    setOurFounderElevenImage,
    ourFounderTwelveImage,
    setOurFounderTwelveImage,
    // About Us section toggles
    aboutCoreValues,
    setAboutCoreValues,
    aboutBranches,
    setAboutBranches,
    ourFounderSixImage,
    setPrivacyPolicy,
    privacyPolicy,
    setPrivacyPolicyHeaderBg,
    privacyPolicyHeaderBg,
    setTermsConditions,
    termsConditions,
    setTermsConditionsHeaderBg,
    termsConditionsHeaderBg,
    setFaqStatus,
    faqStatus,
    setFaqLeftColStatus,
    faqLeftColStatus,
    setFaqRightColStatus,
    faqRightColStatus,
    setFaqHeaderBg,
    faqHeaderBg,
    setFaqLeftColImage,
    faqLeftColImage,
    setOffersPageHeader,
    offersPageHeader,
    setOffersHeaderBg,
    offersHeaderBg,
    setContactPageHeader,
    contactPageHeader,
    setContactHeaderBg,
    contactHeaderBg,
    setEmailUsBox,
    emailUsBox,
    setCallUsBox,
    callUsBox,
    setAddressBox,
    addressBox,
    setContactMidLeftColStatus,
    contactMidLeftColStatus,
    setContactMidLeftColImage,
    contactMidLeftColImage,
    setContactFormStatus,
    contactFormStatus,
    couponList,
    setCouponList,
    couponList1,
    setCouponList1,
    textEdit,
    setTextEdit,
    termsConditionsTextEdit,
    setTermsConditionsTextEdit,
    isSubmitting,
  };
};

export default useStoreHomeSubmit;

