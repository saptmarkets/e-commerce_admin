import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

// Internal imports
import useAboutUs from "../../hooks/useAboutUs";
import BilingualInput from "../common/BilingualInput";
import BilingualTextarea from "../common/BilingualTextarea";
import BilingualToggle from "../common/BilingualToggle";

const AboutUs = () => {
  const { t } = useTranslation();
  const {
    register,
    handleFormSubmit,
    loading,
    submitting,
    aboutUsData,
    isUpdate,
    error
  } = useAboutUs();

  const [activeTab, setActiveTab] = useState("hero");

  const handleSave = async (data) => {
    try {
      await handleFormSubmit(data);
      toast.success(isUpdate ? "About Us updated successfully!" : "About Us saved successfully!");
    } catch (err) {
      toast.error("Failed to save About Us data");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {t("About Us Page Settings")}
        </h2>
        <p className="text-gray-600">
          {t("Configure the content and layout of your About Us page")}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: "hero", label: "Hero Section" },
              { id: "content", label: "Content Sections" },
              { id: "team", label: "Team & Leadership" },
              { id: "values", label: "Values & Community" },
              { id: "heritage", label: "Heritage" },
              { id: "branches", label: "Branches" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <form onSubmit={handleFormSubmit}>
            {/* Hero Section */}
            {activeTab === "hero" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Hero Section</h3>
                
                <BilingualInput
                  label="Page Title"
                  nameEn="about_page_title_en"
                  nameAr="about_page_title_ar"
                  register={register}
                  placeholderEn="About SaptMarkets"
                  placeholderAr="عن سابت ماركتس"
                />

                <BilingualTextarea
                  label="Hero Description"
                  nameEn="about_page_hero_description_en"
                  nameAr="about_page_hero_description_ar"
                  register={register}
                  placeholderEn="Discover our journey of excellence..."
                  placeholderAr="اكتشف رحلتنا نحو التميز..."
                  rows={4}
                />

                <BilingualToggle
                  label="Show Header Section"
                  name="header_status"
                  register={register}
                  defaultValue={aboutUsData?.header_status ?? true}
                />
              </div>
            )}

            {/* Content Sections */}
            {activeTab === "content" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Content Sections</h3>
                
                <BilingualInput
                  label="Top Section Title"
                  nameEn="about_page_top_section_title_en"
                  nameAr="about_page_top_section_title_ar"
                  register={register}
                  placeholderEn="Our Story Begins"
                  placeholderAr="تبدأ قصتنا"
                />

                <BilingualTextarea
                  label="Top Section Description"
                  nameEn="about_page_top_section_description_en"
                  nameAr="about_page_top_section_description_ar"
                  register={register}
                  placeholderEn="From humble beginnings..."
                  placeholderAr="من البدايات المتواضعة..."
                  rows={3}
                />

                <BilingualInput
                  label="Top Title"
                  nameEn="about_page_top_title_en"
                  nameAr="about_page_top_title_ar"
                  register={register}
                  placeholderEn="Building Tomorrow Together"
                  placeholderAr="نبني الغد معاً"
                />

                <BilingualTextarea
                  label="Top Description"
                  nameEn="about_page_top_description_en"
                  nameAr="about_page_top_description_ar"
                  register={register}
                  placeholderEn="We believe in the power of collaboration..."
                  placeholderAr="نؤمن بقوة التعاون..."
                  rows={3}
                />

                <BilingualToggle
                  label="Show Top Content Left"
                  name="content_left_status"
                  register={register}
                  defaultValue={aboutUsData?.content_left_status ?? true}
                />

                <BilingualToggle
                  label="Show Top Content Right"
                  name="content_right_status"
                  register={register}
                  defaultValue={aboutUsData?.content_right_status ?? true}
                />
              </div>
            )}

            {/* Team & Leadership */}
            {activeTab === "team" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Team & Leadership</h3>
                
                <BilingualInput
                  label="Team Title"
                  nameEn="about_page_team_title_en"
                  nameAr="about_page_team_title_ar"
                  register={register}
                  placeholderEn="Our Amazing Team"
                  placeholderAr="فريقنا المذهل"
                />

                <BilingualTextarea
                  label="Team Description"
                  nameEn="about_page_team_description_en"
                  nameAr="about_page_team_description_ar"
                  register={register}
                  placeholderEn="Behind every successful business..."
                  placeholderAr="وراء كل عمل تجاري ناجح..."
                  rows={3}
                />

                <BilingualInput
                  label="Leadership Title"
                  nameEn="about_page_leadership_title_en"
                  nameAr="about_page_leadership_title_ar"
                  register={register}
                  placeholderEn="Inspiring Leadership"
                  placeholderAr="قيادة مُلهمة"
                />

                <BilingualInput
                  label="Leadership Subtitle"
                  nameEn="about_page_leadership_subtitle_en"
                  nameAr="about_page_leadership_subtitle_ar"
                  register={register}
                  placeholderEn="Leading with clear vision..."
                  placeholderAr="قاد برؤية واضحة..."
                />

                <BilingualToggle
                  label="Show Founder Section"
                  name="founder_status"
                  register={register}
                  defaultValue={aboutUsData?.founder_status ?? true}
                />
              </div>
            )}

            {/* Values & Community */}
            {activeTab === "values" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Values & Community</h3>
                
                <BilingualInput
                  label="Values Title"
                  nameEn="about_page_values_title_en"
                  nameAr="about_page_values_title_ar"
                  register={register}
                  placeholderEn="Our Core Values"
                  placeholderAr="قيمنا الأساسية"
                />

                <BilingualTextarea
                  label="Values Description"
                  nameEn="about_page_values_description_en"
                  nameAr="about_page_values_description_ar"
                  register={register}
                  placeholderEn="These fundamental principles..."
                  placeholderAr="هذه المبادئ الأساسية..."
                  rows={3}
                />

                <BilingualInput
                  label="Community Title"
                  nameEn="about_page_community_title_en"
                  nameAr="about_page_community_title_ar"
                  register={register}
                  placeholderEn="Community Impact"
                  placeholderAr="التأثير المجتمعي"
                />

                <BilingualTextarea
                  label="Community Description One"
                  nameEn="about_page_community_description_one_en"
                  nameAr="about_page_community_description_one_ar"
                  register={register}
                  placeholderEn="Our commitment to community development..."
                  placeholderAr="التزامنا بالتنمية المجتمعية..."
                  rows={3}
                />

                <BilingualTextarea
                  label="Community Description Two"
                  nameEn="about_page_community_description_two_en"
                  nameAr="about_page_community_description_two_ar"
                  register={register}
                  placeholderEn="Through partnerships with local organizations..."
                  placeholderAr="من خلال الشراكة مع المنظمات المحلية..."
                  rows={3}
                />
              </div>
            )}

            {/* Heritage */}
            {activeTab === "heritage" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Heritage</h3>
                
                <BilingualInput
                  label="Heritage Title"
                  nameEn="about_page_heritage_title_en"
                  nameAr="about_page_heritage_title_ar"
                  register={register}
                  placeholderEn="Our Heritage"
                  placeholderAr="تراثنا"
                />

                <BilingualTextarea
                  label="Heritage Description One"
                  nameEn="about_page_heritage_description_one_en"
                  nameAr="about_page_heritage_description_one_ar"
                  register={register}
                  placeholderEn="Founded in 1995, SaptMarkets began..."
                  placeholderAr="تأسست سابت ماركتس في عام 1995..."
                  rows={3}
                />

                <BilingualTextarea
                  label="Heritage Description Two"
                  nameEn="about_page_heritage_description_two_en"
                  nameAr="about_page_heritage_description_two_ar"
                  register={register}
                  placeholderEn="Over the decades, we've grown..."
                  placeholderAr="على مدى العقود، نمينا..."
                  rows={3}
                />

                <BilingualToggle
                  label="Show Middle Content Section"
                  name="content_middle_status"
                  register={register}
                  defaultValue={aboutUsData?.content_middle_status ?? true}
                />
              </div>
            )}

            {/* Branches */}
            {activeTab === "branches" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Branches</h3>
                
                <BilingualInput
                  label="Branches Title"
                  nameEn="about_page_branches_title_en"
                  nameAr="about_page_branches_title_ar"
                  register={register}
                  placeholderEn="Our Network"
                  placeholderAr="شبكتنا"
                />

                <BilingualTextarea
                  label="Branches Description"
                  nameEn="about_page_branches_description_en"
                  nameAr="about_page_branches_description_ar"
                  register={register}
                  placeholderEn="With strategically located branches..."
                  placeholderAr="مع الفروع الاستراتيجية..."
                  rows={3}
                />

                <BilingualInput
                  label="Branches CTA Title"
                  nameEn="about_page_branches_cta_title_en"
                  nameAr="about_page_branches_cta_title_ar"
                  register={register}
                  placeholderEn="Visit Us Today"
                  placeholderAr="زرنا اليوم"
                />

                <BilingualTextarea
                  label="Branches CTA Description"
                  nameEn="about_page_branches_cta_description_en"
                  nameAr="about_page_branches_cta_description_ar"
                  register={register}
                  placeholderEn="Experience the SaptMarkets difference..."
                  placeholderAr="اختبر فرق سابت ماركتس..."
                  rows={3}
                />

                <BilingualInput
                  label="Upcoming Branches Title"
                  nameEn="about_page_upcoming_branches_title_en"
                  nameAr="about_page_upcoming_branches_title_ar"
                  register={register}
                  placeholderEn="Coming Soon"
                  placeholderAr="قريباً"
                />

                <BilingualToggle
                  label="Show Branches Section"
                  name="branches_status"
                  register={register}
                  defaultValue={aboutUsData?.branches_status ?? true}
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isUpdate ? "Updating..." : "Saving..."}
                  </span>
                ) : (
                  isUpdate ? "Update About Us" : "Save About Us"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
