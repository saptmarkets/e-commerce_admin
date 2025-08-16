import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

//internal import
import SettingServices from "@/services/SettingServices";

const useStoreHomeSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const history = useHistory();
  const { t } = useTranslation();

  // Form handling
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  // State variables for essential settings only
  const [headerLogo, setHeaderLogo] = useState("");
  const [footerLogo, setFooterLogo] = useState("");
  const [paymentImage, setPaymentImage] = useState("");
  
  // Footer block states
  const [footerBlock1, setFooterBlock1] = useState(false);
  const [footerBlock2, setFooterBlock2] = useState(false);
  const [footerBlock3, setFooterBlock3] = useState(false);
  const [footerBlock4, setFooterBlock4] = useState(false);
  const [footerSocialLinks, setFooterSocialLinks] = useState(false);
  const [footerPaymentMethod, setFooterPaymentMethod] = useState(false);
  const [footerBottomContact, setFooterBottomContact] = useState(false);
  
  // Menu link states
  const [categoriesMenuLink, setCategoriesMenuLink] = useState("");
  const [aboutUsMenuLink, setAboutUsMenuLink] = useState("");
  const [contactUsMenuLink, setContactUsMenuLink] = useState("");
  const [offersMenuLink, setOffersMenuLink] = useState("");
  const [faqMenuLink, setFaqMenuLink] = useState("");
  const [privacyPolicyMenuLink, setPrivacyPolicyMenuLink] = useState("");
  const [termsConditionsMenuLink, setTermsConditionsMenuLink] = useState("");

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setIsSave(false);

      // Prepare the data object in the correct structure that backend expects
      const storeCustomizationSettingData = {
        name: "storeCustomizationSetting",
        setting: {
          navbar: {
            // Header settings
            help_text: {
              en: data.help_text || "",
              ar: data.help_text || ""
            },
            phone: data.phone_number || "",
            logo: headerLogo || "",
            
            // Menu editor settings
            categories: {
              en: data.categories || "",
              ar: data.categories || ""
            },
            about_us: {
              en: data.about_us || "",
              ar: data.about_us || ""
            },
            contact_us: {
              en: data.contact_us || "",
              ar: data.contact_us || ""
            },
            offers: {
              en: data.offers || "",
              ar: data.offers || ""
            },
            faq: {
              en: data.faq || "",
              ar: data.faq || ""
            },
            privacy_policy: {
              en: data.privacy_policy || "",
              ar: data.privacy_policy || ""
            },
            term_and_condition: {
              en: data.term_and_condition || "",
              ar: data.term_and_condition || ""
            },
            pages: {
              en: data.pages || "",
              ar: data.pages || ""
            },
            my_account: {
              en: data.my_account || "",
              ar: data.my_account || ""
            },
            login: {
              en: data.login || "",
              ar: data.login || ""
            },
            logout: {
              en: data.logout || "",
              ar: data.logout || ""
            },
            checkout: {
              en: data.checkout || "",
              ar: data.checkout || ""
            },
            
            // Menu status toggles
            categories_menu_status: categoriesMenuLink,
            about_menu_status: aboutUsMenuLink,
            contact_menu_status: contactUsMenuLink,
            offers_menu_status: offersMenuLink,
            faq_status: faqMenuLink,
            privacy_policy_status: privacyPolicyMenuLink,
            term_and_condition_status: termsConditionsMenuLink,
          },
          footer: {
            logo: footerLogo || "",
            payment_image: paymentImage || "",
            footer_block_one: footerBlock1,
            footer_block_two: footerBlock2,
            footer_block_three: footerBlock3,
            footer_block_four: footerBlock4,
            footer_social_links: footerSocialLinks,
            footer_payment_method: footerPaymentMethod,
            footer_bottom_contact: footerBottomContact,
          }
        }
      };

      // Debug: Log what we're sending
      console.log("Submitting data:", storeCustomizationSettingData);
      console.log("Form data:", data);

      const res = await SettingServices.updateStoreCustomizationSetting(storeCustomizationSettingData);

      if (res) {
        toast.success(t("StoreHomeUpdatedSuccessfully"));
        setIsSubmitting(false);
        setIsSave(false);
        history.push("/store-home");
      }
    } catch (error) {
      console.error("Update failed:", error);
      setIsSubmitting(false);
      setIsSave(false);
      toast.error(t("StoreHomeUpdateFailed"));
    }
  };

  return {
    // Form handling
    register,
    handleSubmit,
    setValue,
    control,
    errors,
    
    // Submit handling
    onSubmit,
    isSubmitting,
    isSave,
    
    // Header states
    headerLogo,
    setHeaderLogo,
    
    // Footer states
    footerLogo,
    setFooterLogo,
    paymentImage,
    setPaymentImage,
    
    // Footer block states
    footerBlock1,
    setFooterBlock1,
    footerBlock2,
    setFooterBlock2,
    footerBlock3,
    setFooterBlock3,
    footerBlock4,
    setFooterBlock4,
    footerSocialLinks,
    setFooterSocialLinks,
    footerPaymentMethod,
    setFooterPaymentMethod,
    footerBottomContact,
    setFooterBottomContact,
    
    // Menu link states
    categoriesMenuLink,
    setCategoriesMenuLink,
    aboutUsMenuLink,
    setAboutUsMenuLink,
    contactUsMenuLink,
    setContactUsMenuLink,
    offersMenuLink,
    setOffersMenuLink,
    faqMenuLink,
    setFaqMenuLink,
    privacyPolicyMenuLink,
    setPrivacyPolicyMenuLink,
    termsConditionsMenuLink,
    setTermsConditionsMenuLink,
  };
};

export default useStoreHomeSubmit;
