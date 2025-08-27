import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

//internal import
import { SidebarContext } from "@/context/SidebarContext";
import CategoryServices from "@/services/CategoryServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import useTranslationValue from "./useTranslationValue";

const useCategorySubmit = (id, data) => {
  const { isDrawerOpen, closeDrawer, setIsUpdate, lang } =
    useContext(SidebarContext);
  const [resData, setResData] = useState({});
  const [checked, setChecked] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [headerImageUrl, setHeaderImageUrl] = useState("");
  const [children, setChildren] = useState([]);
  const [language, setLanguage] = useState("en");
  const [published, setPublished] = useState(true);
  const [selectCategoryName, setSelectCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMain, setIsMain] = useState(false);

  const { handlerTextTranslateHandler } = useTranslationValue();

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ name, description }) => {
    try {
      setIsSubmitting(true);

      // Preserve existing translations; only update the active language field
      const existingName = resData?.name && typeof resData.name === 'object' ? resData.name : {};
      const existingDescription = resData?.description && typeof resData.description === 'object' ? resData.description : {};

      const safeName = { ...existingName, [language]: name };
      const safeDescription = { ...existingDescription, [language]: description || "" };

      // If this is a new category, generate translations; otherwise keep existing
      let finalName = safeName;
      let finalDescription = safeDescription;
      if (!id) {
        const nameTranslates = await handlerTextTranslateHandler(name, language, existingName);
        const descTranslates = await handlerTextTranslateHandler(description, language, existingDescription);
        finalName = { ...nameTranslates, [language]: name };
        finalDescription = { ...descTranslates, [language]: description || "" };
      }

      // Determine parent fields based on isMain toggle
      let parentIdField = checked || undefined;
      let parentNameField = selectCategoryName ? selectCategoryName : "Home";
      if (isMain) {
        parentIdField = null;
        parentNameField = "Home";
      }

      const categoryData = {
        name: finalName,
        description: finalDescription,
        parentId: parentIdField,
        parentName: parentNameField,
        icon: imageUrl,
        headerImage: headerImageUrl,
        status: published ? "show" : "hide",
        lang: language,
      };

      if (id) {
        const res = await CategoryServices.updateCategory(id, categoryData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        reset();
      } else {
        const res = await CategoryServices.addCategory(categoryData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      }
    } catch (err) {
      setIsSubmitting(false);
      notifyError(err ? err?.response?.data?.message : err?.message);
      closeDrawer();
    }
  };

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);
    if (Object.keys(resData).length > 0) {
      setValue("name", resData.name[lang ? lang : "en"]);
      setValue("description", resData.description[lang ? lang : "en"]);
    }
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setResData({});
      setValue("name");
      setValue("parentId");
      setValue("parentName");
      setValue("description");
      setValue("icon");
      setImageUrl("");
      setHeaderImageUrl("");
      setPublished(true);
      setIsMain(false);
      clearErrors("name");
      clearErrors("parentId");
      clearErrors("parentName");
      clearErrors("description");
      setSelectCategoryName("Home");
      setLanguage(lang);
      setValue("language", language);

      if (data !== undefined && data[0]?._id !== undefined) {
        setChecked(data[0]._id);
      }
      return;
    }
    if (id) {
      (async () => {
        try {
          const res = await CategoryServices.getCategoryById(id);

          if (res) {
            setResData(res);
            setValue("name", res.name[language ? language : "en"]);
            setValue(
              "description",
              res.description[language ? language : "en"]
            );
            setValue("language", language);
            setValue("parentId", res.parentId);
            setValue("parentName", res.parentName);
            setSelectCategoryName(res.parentName);
            setChecked(res.parentId);
            setImageUrl(res.icon);
            setHeaderImageUrl(res.headerImage || "");
            setPublished(res.status === "show" ? true : false);
            setIsMain(!res.parentId);
          }
        } catch (err) {
          notifyError(err ? err.response.data.message : err.message);
        }
      })();
    }
  }, [id, setValue, isDrawerOpen, language, clearErrors, data, lang]);

  // When switching to main category, clear any selected parent and set Home label in the UI
  useEffect(() => {
    if (isMain) {
      setChecked("");
      setSelectCategoryName("Home");
    }
  }, [isMain]);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    imageUrl,
    setImageUrl,
    headerImageUrl,
    setHeaderImageUrl,
    children,
    setChildren,
    published,
    setPublished,
    checked,
    setChecked,
    isSubmitting,
    selectCategoryName,
    setSelectCategoryName,
    handleSelectLanguage,
    isMain,
    setIsMain,
  };
};

export default useCategorySubmit;
