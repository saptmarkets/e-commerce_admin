import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

//internal import
import { StoreHomeServices } from "@/services/StoreHomeServices";

const useStoreHomeSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSave, setIsSave] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setIsSave(true);

      // Prepare the data object with only essential fields
      const submitData = {
        // Header settings
        help_text: data.help_text,
        phone_number: data.phone_number,
        header_logo: data.header_logo,
        
        // Menu editor settings
        categories: data.categories,
        about_us: data.about_us,
        contact_us: data.contact_us,
        offers: data.offers,
        faq: data.faq,
        privacy_policy: data.privacy_policy,
        term_and_condition: data.term_and_condition,
        pages: data.pages,
        my_account: data.my_account,
        login: data.login,
        logout: data.logout,
        checkout: data.checkout,
        
        // Footer settings
        footer_logo: data.footer_logo,
        payment_image: data.payment_image,
        footer_block_one: data.footer_block_one,
        footer_block_two: data.footer_block_two,
        footer_block_three: data.footer_block_three,
        footer_block_four: data.footer_block_four,
        footer_social_links: data.footer_social_links,
        footer_payment_method: data.footer_payment_method,
        footer_bottom_contact: data.footer_bottom_contact,
      };

      const res = await StoreHomeServices.updateStoreHome(submitData);

      if (res) {
        toast.success(t("StoreHomeUpdatedSuccessfully"));
        setIsSubmitting(false);
        setIsSave(false);
        router.push("/store-home");
      }
    } catch (error) {
      setIsSubmitting(false);
      setIsSave(false);
      toast.error(t("StoreHomeUpdateFailed"));
    }
  };

  return {
    onSubmit,
    isSubmitting,
    isSave,
  };
};

export default useStoreHomeSubmit;
