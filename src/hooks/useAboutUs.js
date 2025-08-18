import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import SettingServices from "../services/SettingServices";

const useAboutUs = () => {
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aboutUsData, setAboutUsData] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const isInitialMount = useRef(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  // Fetch About Us data
  const fetchAboutUsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔍 Fetching About Us data...");
      const response = await SettingServices.getAboutUs();
      console.log("🔍 About Us API Response:", response);
      
      if (response && response.data && Object.keys(response.data).length > 0) {
        // Check if we have actual content, not just empty objects
        const hasContent = Object.values(response.data).some(value => {
          if (typeof value === 'object' && value !== null) {
            return Object.values(value).some(subValue => 
              subValue && typeof subValue === 'string' && subValue.trim() !== ''
            );
          }
          return value && value !== '';
        });
        
        if (hasContent) {
          console.log("✅ Found existing About Us data with content");
          setAboutUsData(response.data);
          populateFormFields(response.data);
          setIsUpdate(true);
        } else {
          console.log("⚠️ Found About Us data but it's empty, not overwriting");
          setAboutUsData({});
          setIsUpdate(false);
        }
      } else {
        console.log("⚠️ No About Us data found, not creating empty structure");
        setAboutUsData({});
        setIsUpdate(false);
      }
    } catch (err) {
      console.error("❌ Error fetching About Us data:", err);
      setError("Failed to load About Us data");
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  };

  // Populate form fields with fetched data - only if data exists
  const populateFormFields = (data) => {
    console.log("🔍 Populating form fields with data:", data);
    
    // Only populate if we have actual data
    if (!data || Object.keys(data).length === 0) {
      console.log("⚠️ No data to populate, skipping");
      return;
    }
    
    // Hero Section
    if (data.title?.en || data.title?.ar) {
      setValue("about_page_title_en", data.title.en || "");
      setValue("about_page_title_ar", data.title.ar || "");
    }
    
    if (data.hero_description?.en || data.hero_description?.ar) {
      setValue("about_page_hero_description_en", data.hero_description.en || "");
      setValue("about_page_hero_description_ar", data.hero_description.ar || "");
    }

    // Top Section
    if (data.top_section_title?.en || data.top_section_title?.ar) {
      setValue("about_page_top_section_title_en", data.top_section_title.en || "");
      setValue("about_page_top_section_title_ar", data.top_section_title.ar || "");
    }
    
    if (data.top_section_description?.en || data.top_section_description?.ar) {
      setValue("about_page_top_section_description_en", data.top_section_description.en || "");
      setValue("about_page_top_section_description_ar", data.top_section_description.ar || "");
    }
    
    if (data.top_title?.en || data.top_title?.ar) {
      setValue("about_page_top_title_en", data.top_title.en || "");
      setValue("about_page_top_title_ar", data.top_title.ar || "");
    }
    
    if (data.top_description?.en || data.top_description?.ar) {
      setValue("about_page_top_description_en", data.top_description.en || "");
      setValue("about_page_top_description_ar", data.top_description.ar || "");
    }

    // Cards Section
    if (data.card_one_title?.en || data.card_one_title?.ar) {
      setValue("about_page_card_one_title_en", data.card_one_title.en || "");
      setValue("about_page_card_one_title_ar", data.card_one_title.ar || "");
    }
    
    if (data.card_one_sub?.en || data.card_one_sub?.ar) {
      setValue("about_page_card_one_subtitle_en", data.card_one_sub.en || "");
      setValue("about_page_card_one_subtitle_ar", data.card_one_sub.ar || "");
    }
    
    if (data.card_one_description?.en || data.card_one_description?.ar) {
      setValue("about_page_card_one_description_en", data.card_one_description.en || "");
      setValue("about_page_card_one_description_ar", data.card_one_description.ar || "");
    }
    
    if (data.card_two_title?.en || data.card_two_title?.ar) {
      setValue("about_page_card_two_title_en", data.card_two_title.en || "");
      setValue("about_page_card_two_title_ar", data.card_two_title.ar || "");
    }
    
    if (data.card_two_sub?.en || data.card_two_sub?.ar) {
      setValue("about_page_card_two_subtitle_en", data.card_two_sub.en || "");
      setValue("about_page_card_two_subtitle_ar", data.card_two_sub.ar || "");
    }
    
    if (data.card_two_description?.en || data.card_two_description?.ar) {
      setValue("about_page_card_two_description_en", data.card_two_description.en || "");
      setValue("about_page_card_two_description_ar", data.card_two_description.ar || "");
    }

    // Middle Content
    if (data.middle_description_one?.en || data.middle_description_one?.ar) {
      setValue("about_us_middle_description_one_en", data.middle_description_one.en || "");
      setValue("about_us_middle_description_one_ar", data.middle_description_one.ar || "");
    }
    
    if (data.middle_description_two?.en || data.middle_description_two?.ar) {
      setValue("about_us_middle_description_two_en", data.middle_description_two.en || "");
      setValue("about_us_middle_description_two_ar", data.middle_description_two.ar || "");
    }

    // Team Section
    if (data.team_title?.en || data.team_title?.ar) {
      setValue("about_page_team_title_en", data.team_title.en || "");
      setValue("about_page_team_title_ar", data.team_title.ar || "");
    }
    
    if (data.team_description?.en || data.team_description?.ar) {
      setValue("about_page_team_description_en", data.team_description.en || "");
      setValue("about_page_team_description_ar", data.team_description.ar || "");
    }

    // Leadership Section
    if (data.leadership_title?.en || data.leadership_title?.ar) {
      setValue("about_page_leadership_title_en", data.leadership_title.en || "");
      setValue("about_page_leadership_title_ar", data.leadership_title.ar || "");
    }
    
    if (data.leadership_subtitle?.en || data.leadership_subtitle?.ar) {
      setValue("about_page_leadership_subtitle_en", data.leadership_subtitle.en || "");
      setValue("about_page_leadership_subtitle_ar", data.leadership_subtitle.ar || "");
    }

    // Values Section
    if (data.values_title?.en || data.values_title?.ar) {
      setValue("about_page_values_title_en", data.values_title.en || "");
      setValue("about_page_values_title_ar", data.values_title.ar || "");
    }
    
    if (data.values_description?.en || data.values_description?.ar) {
      setValue("about_page_values_description_en", data.values_description.en || "");
      setValue("about_page_values_description_ar", data.values_description.ar || "");
    }
    
    if (data.value_one_title?.en || data.value_one_title?.ar) {
      setValue("about_page_value_one_title_en", data.value_one_title.en || "");
      setValue("about_page_value_one_title_ar", data.value_one_title.ar || "");
    }
    
    if (data.value_one_description?.en || data.value_one_description?.ar) {
      setValue("about_page_value_one_description_en", data.value_one_description.en || "");
      setValue("about_page_value_one_description_ar", data.value_one_description.ar || "");
    }
    
    if (data.value_two_title?.en || data.value_two_title?.ar) {
      setValue("about_page_value_two_title_en", data.value_two_title.en || "");
      setValue("about_page_value_two_title_ar", data.value_two_title.ar || "");
    }
    
    if (data.value_two_description?.en || data.value_two_description?.ar) {
      setValue("about_page_value_two_description_en", data.value_two_description.en || "");
      setValue("about_page_value_two_description_ar", data.value_two_description.ar || "");
    }
    
    if (data.value_three_title?.en || data.value_three_title?.ar) {
      setValue("about_page_value_three_title_en", data.value_three_title.en || "");
      setValue("about_page_value_three_title_ar", data.value_three_title.ar || "");
    }
    
    if (data.value_three_description?.en || data.value_three_description?.ar) {
      setValue("about_page_value_three_description_en", data.value_three_description.en || "");
      setValue("about_page_value_three_description_ar", data.value_three_description.ar || "");
    }
    
    if (data.value_four_title?.en || data.value_four_title?.ar) {
      setValue("about_page_value_four_title_en", data.value_four_title.en || "");
      setValue("about_page_value_four_title_ar", data.value_four_title.ar || "");
    }
    
    if (data.value_four_description?.en || data.value_four_description?.ar) {
      setValue("about_page_value_four_description_en", data.value_four_description.en || "");
      setValue("about_page_value_four_description_ar", data.value_four_description.ar || "");
    }

    // Heritage Section
    if (data.heritage_title?.en || data.heritage_title?.ar) {
      setValue("about_page_heritage_title_en", data.heritage_title.en || "");
      setValue("about_page_heritage_title_ar", data.heritage_title.ar || "");
    }
    
    if (data.heritage_description_one?.en || data.heritage_description_one?.ar) {
      setValue("about_page_heritage_description_one_en", data.heritage_description_one.en || "");
      setValue("about_page_heritage_description_one_ar", data.heritage_description_one.ar || "");
    }
    
    if (data.heritage_description_two?.en || data.heritage_description_two?.ar) {
      setValue("about_page_heritage_description_two_en", data.heritage_description_two.en || "");
      setValue("about_page_heritage_description_two_ar", data.heritage_description_two.ar || "");
    }

    // Community Section
    if (data.community_title?.en || data.community_title?.ar) {
      setValue("about_page_community_title_en", data.community_title.en || "");
      setValue("about_page_community_title_ar", data.community_title.ar || "");
    }
    
    if (data.community_description_one?.en || data.community_description_one?.ar) {
      setValue("about_page_community_description_one_en", data.community_description_one.en || "");
      setValue("about_page_community_description_one_ar", data.community_description_one.ar || "");
    }
    
    if (data.community_description_two?.en || data.community_description_two?.ar) {
      setValue("about_page_community_description_two_en", data.community_description_two.en || "");
      setValue("about_page_community_description_two_ar", data.community_description_two.ar || "");
    }
    
    if (data.community_stat_one_number?.en || data.community_stat_one_number?.ar) {
      setValue("about_page_community_stat_one_number_en", data.community_stat_one_number.en || "");
      setValue("about_page_community_stat_one_number_ar", data.community_stat_one_number.ar || "");
    }
    
    if (data.community_stat_one_label?.en || data.community_stat_one_label?.ar) {
      setValue("about_page_community_stat_one_label_en", data.community_stat_one_label.en || "");
      setValue("about_page_community_stat_one_label_ar", data.community_stat_one_label.ar || "");
    }
    
    if (data.community_stat_two_number?.en || data.community_stat_two_number?.ar) {
      setValue("about_page_community_stat_two_number_en", data.community_stat_two_number.en || "");
      setValue("about_page_community_stat_two_number_ar", data.community_stat_two_number.ar || "");
    }
    
    if (data.community_stat_two_label?.en || data.community_stat_two_label?.ar) {
      setValue("about_page_community_stat_two_label_en", data.community_stat_two_label.en || "");
      setValue("about_page_community_stat_two_label_ar", data.community_stat_two_label.ar || "");
    }
    
    if (data.community_cta_title?.en || data.community_cta_title?.ar) {
      setValue("about_page_community_cta_title_en", data.community_cta_title.en || "");
      setValue("about_page_community_cta_title_ar", data.community_cta_title.ar || "");
    }
    
    if (data.community_cta_description?.en || data.community_cta_description?.ar) {
      setValue("about_page_community_cta_description_en", data.community_cta_description.en || "");
      setValue("about_page_community_cta_description_ar", data.community_cta_description.ar || "");
    }

    // Founder Fields (1-12) - only populate if data exists
    for (let i = 1; i <= 12; i++) {
      const num = i === 1 ? "one" : i === 2 ? "two" : i === 3 ? "three" : i === 4 ? "four" : 
                  i === 5 ? "five" : i === 6 ? "six" : i === 7 ? "seven" : i === 8 ? "eight" : 
                  i === 9 ? "nine" : i === 10 ? "ten" : i === 11 ? "eleven" : "twelve";
      
      const founderName = data[`founder_${num}_name`];
      const founderPosition = data[`founder_${num}_position`];
      const founderSub = data[`founder_${num}_sub`];
      
      if (founderName?.en || founderName?.ar) {
        setValue(`about_page_founder_${num}_name_en`, founderName.en || "");
        setValue(`about_page_founder_${num}_name_ar`, founderName.ar || "");
      }
      
      if (founderPosition?.en || founderPosition?.ar) {
        setValue(`about_page_founder_${num}_position_en`, founderPosition.en || "");
        setValue(`about_page_founder_${num}_position_ar`, founderPosition.ar || "");
      }
      
      if (founderSub?.en || founderSub?.ar) {
        setValue(`about_page_founder_${num}_subtitle_en`, founderSub.en || "");
        setValue(`about_page_founder_${num}_subtitle_ar`, founderSub.ar || "");
      }
    }

    // Trusted Badges
    if (data.trusted_badge_one_pill?.en || data.trusted_badge_one_pill?.ar) {
      setValue("about_page_trusted_badge_one_pill_en", data.trusted_badge_one_pill.en || "");
      setValue("about_page_trusted_badge_one_pill_ar", data.trusted_badge_one_pill.ar || "");
    }
    
    if (data.trusted_badge_one_text?.en || data.trusted_badge_one_text?.ar) {
      setValue("about_page_trusted_badge_one_text_en", data.trusted_badge_one_text.en || "");
      setValue("about_page_trusted_badge_one_text_ar", data.trusted_badge_one_text.ar || "");
    }
    
    if (data.trusted_badge_two_pill?.en || data.trusted_badge_two_pill?.ar) {
      setValue("about_page_trusted_badge_two_pill_en", data.trusted_badge_two_pill.en || "");
      setValue("about_page_trusted_badge_two_pill_ar", data.trusted_badge_two_pill.ar || "");
    }
    
    if (data.trusted_badge_two_text?.en || data.trusted_badge_two_text?.ar) {
      setValue("about_page_trusted_badge_two_text_en", data.trusted_badge_two_text.en || "");
      setValue("about_page_trusted_badge_two_text_ar", data.trusted_badge_two_text.ar || "");
    }

    // Branches Section
    if (data.branches_title?.en || data.branches_title?.ar) {
      setValue("about_page_branches_title_en", data.branches_title.en || "");
      setValue("about_page_branches_title_ar", data.branches_title.ar || "");
    }
    
    if (data.branches_description?.en || data.branches_description?.ar) {
      setValue("about_page_branches_description_en", data.branches_description.en || "");
      setValue("about_page_branches_description_ar", data.branches_description.ar || "");
    }
    
    if (data.branches_cta_title?.en || data.branches_cta_title?.ar) {
      setValue("about_page_branches_cta_title_en", data.branches_cta_title.en || "");
      setValue("about_page_branches_cta_title_ar", data.branches_cta_title.ar || "");
    }
    
    if (data.branches_cta_description?.en || data.branches_cta_description?.ar) {
      setValue("about_page_branches_cta_description_en", data.branches_cta_description.en || "");
      setValue("about_page_branches_cta_description_ar", data.branches_cta_description.ar || "");
    }
    
    if (data.upcoming_branches_title?.en || data.upcoming_branches_title?.ar) {
      setValue("about_page_upcoming_branches_title_en", data.upcoming_branches_title.en || "");
      setValue("about_page_upcoming_branches_title_ar", data.upcoming_branches_title.ar || "");
    }

    // Upcoming Branches
    if (data.upcoming_branch_one_name?.en || data.upcoming_branch_one_name?.ar) {
      setValue("about_page_upcoming_branch_one_name_en", data.upcoming_branch_one_name.en || "");
      setValue("about_page_upcoming_branch_one_name_ar", data.upcoming_branch_one_name.ar || "");
    }
    
    if (data.upcoming_branch_one_address?.en || data.upcoming_branch_one_address?.ar) {
      setValue("about_page_upcoming_branch_one_address_en", data.upcoming_branch_one_address.en || "");
      setValue("about_page_upcoming_branch_one_address_ar", data.upcoming_branch_one_address.ar || "");
    }
    
    if (data.upcoming_branch_one_quarter?.en || data.upcoming_branch_one_quarter?.ar) {
      setValue("about_page_upcoming_branch_one_quarter_en", data.upcoming_branch_one_quarter.en || "");
      setValue("about_page_upcoming_branch_one_quarter_ar", data.upcoming_branch_one_quarter.ar || "");
    }
    
    if (data.upcoming_branch_one_features?.en || data.upcoming_branch_one_features?.ar) {
      setValue("about_page_upcoming_branch_one_features_en", data.upcoming_branch_one_features.en || "");
      setValue("about_page_upcoming_branch_one_features_ar", data.upcoming_branch_one_features.ar || "");
    }
    
    if (data.upcoming_branch_one_emoji?.en || data.upcoming_branch_one_emoji?.ar) {
      setValue("about_page_upcoming_branch_one_emoji_en", data.upcoming_branch_one_emoji.en || "");
      setValue("about_page_upcoming_branch_one_emoji_ar", data.upcoming_branch_one_emoji.ar || "");
    }

    if (data.upcoming_branch_two_name?.en || data.upcoming_branch_two_name?.ar) {
      setValue("about_page_upcoming_branch_two_name_en", data.upcoming_branch_two_name.en || "");
      setValue("about_page_upcoming_branch_two_name_ar", data.upcoming_branch_two_name.ar || "");
    }
    
    if (data.upcoming_branch_two_address?.en || data.upcoming_branch_two_address?.ar) {
      setValue("about_page_upcoming_branch_two_address_en", data.upcoming_branch_two_address.en || "");
      setValue("about_page_upcoming_branch_two_address_ar", data.upcoming_branch_two_address.ar || "");
    }
    
    if (data.upcoming_branch_two_quarter?.en || data.upcoming_branch_two_quarter?.ar) {
      setValue("about_page_upcoming_branch_two_quarter_en", data.upcoming_branch_two_quarter.en || "");
      setValue("about_page_upcoming_branch_two_quarter_ar", data.upcoming_branch_two_quarter.ar || "");
    }
    
    if (data.upcoming_branch_two_features?.en || data.upcoming_branch_two_features?.ar) {
      setValue("about_page_upcoming_branch_two_features_en", data.upcoming_branch_two_features.en || "");
      setValue("about_page_upcoming_branch_two_features_ar", data.upcoming_branch_two_features.ar || "");
    }
    
    if (data.upcoming_branch_two_emoji?.en || data.upcoming_branch_two_emoji?.ar) {
      setValue("about_page_upcoming_branch_two_emoji_en", data.upcoming_branch_two_emoji.en || "");
      setValue("about_page_upcoming_branch_two_emoji_ar", data.upcoming_branch_two_emoji.ar || "");
    }

    console.log("✅ Form fields populated successfully");
  };

  // Submit About Us data
  const onSubmit = async (formData) => {
    try {
      setSubmitting(true);
      setError(null);
      
      console.log("🔍 Submitting About Us data:", formData);
      
      // Transform form data to API format
      const aboutUsPayload = {
        title: {
          en: formData.about_page_title_en || "",
          ar: formData.about_page_title_ar || ""
        },
        hero_description: {
          en: formData.about_page_hero_description_en || "",
          ar: formData.about_page_hero_description_ar || ""
        },
        top_section_title: {
          en: formData.about_page_top_section_title_en || "",
          ar: formData.about_page_top_section_title_ar || ""
        },
        top_section_description: {
          en: formData.about_page_top_section_description_en || "",
          ar: formData.about_page_top_section_description_ar || ""
        },
        top_title: {
          en: formData.about_page_top_title_en || "",
          ar: formData.about_page_top_title_ar || ""
        },
        top_description: {
          en: formData.about_page_top_description_en || "",
          ar: formData.about_page_top_description_ar || ""
        },
        card_one_title: {
          en: formData.about_page_card_one_title_en || "",
          ar: formData.about_page_card_one_title_ar || ""
        },
        card_one_sub: {
          en: formData.about_page_card_one_subtitle_en || "",
          ar: formData.about_page_card_one_subtitle_ar || ""
        },
        card_one_description: {
          en: formData.about_page_card_one_description_en || "",
          ar: formData.about_page_card_one_description_ar || ""
        },
        card_two_title: {
          en: formData.about_page_card_two_title_en || "",
          ar: formData.about_page_card_two_title_ar || ""
        },
        card_two_sub: {
          en: formData.about_page_card_two_subtitle_en || "",
          ar: formData.about_page_card_two_subtitle_ar || ""
        },
        card_two_description: {
          en: formData.about_page_card_two_description_en || "",
          ar: formData.about_page_card_two_description_ar || ""
        },
        middle_description_one: {
          en: formData.about_us_middle_description_one_en || "",
          ar: formData.about_us_middle_description_one_ar || ""
        },
        middle_description_two: {
          en: formData.about_us_middle_description_two_en || "",
          ar: formData.about_us_middle_description_two_ar || ""
        },
        team_title: {
          en: formData.about_page_team_title_en || "",
          ar: formData.about_page_team_title_ar || ""
        },
        team_description: {
          en: formData.about_page_team_description_en || "",
          ar: formData.about_page_team_description_ar || ""
        },
        leadership_title: {
          en: formData.about_page_leadership_title_en || "",
          ar: formData.about_page_leadership_title_ar || ""
        },
        leadership_subtitle: {
          en: formData.about_page_leadership_subtitle_en || "",
          ar: formData.about_page_leadership_subtitle_ar || ""
        },
        values_title: {
          en: formData.about_page_values_title_en || "",
          ar: formData.about_page_values_title_ar || ""
        },
        values_description: {
          en: formData.about_page_values_description_en || "",
          ar: formData.about_page_values_description_ar || ""
        },
        value_one_title: {
          en: formData.about_page_value_one_title_en || "",
          ar: formData.about_page_value_one_title_ar || ""
        },
        value_one_description: {
          en: formData.about_page_value_one_description_en || "",
          ar: formData.about_page_value_one_description_ar || ""
        },
        value_two_title: {
          en: formData.about_page_value_two_title_en || "",
          ar: formData.about_page_value_two_title_ar || ""
        },
        value_two_description: {
          en: formData.about_page_value_two_description_en || "",
          ar: formData.about_page_value_two_description_ar || ""
        },
        value_three_title: {
          en: formData.about_page_value_three_title_en || "",
          ar: formData.about_page_value_three_title_ar || ""
        },
        value_three_description: {
          en: formData.about_page_value_three_description_en || "",
          ar: formData.about_page_value_three_description_ar || ""
        },
        value_four_title: {
          en: formData.about_page_value_four_title_en || "",
          ar: formData.about_page_value_four_title_ar || ""
        },
        value_four_description: {
          en: formData.about_page_value_four_description_en || "",
          ar: formData.about_page_value_four_description_ar || ""
        },
        heritage_title: {
          en: formData.about_page_heritage_title_en || "",
          ar: formData.about_page_heritage_title_ar || ""
        },
        heritage_description_one: {
          en: formData.about_page_heritage_description_one_en || "",
          ar: formData.about_page_heritage_description_one_ar || ""
        },
        heritage_description_two: {
          en: formData.about_page_heritage_description_two_en || "",
          ar: formData.about_page_heritage_description_two_ar || ""
        },
        community_title: {
          en: formData.about_page_community_title_en || "",
          ar: formData.about_page_community_title_ar || ""
        },
        community_description_one: {
          en: formData.about_page_community_description_one_en || "",
          ar: formData.about_page_community_description_one_ar || ""
        },
        community_description_two: {
          en: formData.about_page_community_description_two_en || "",
          ar: formData.about_page_community_description_two_ar || ""
        },
        community_stat_one_number: {
          en: formData.about_page_community_stat_one_number_en || "",
          ar: formData.about_page_community_stat_one_number_ar || ""
        },
        community_stat_one_label: {
          en: formData.about_page_community_stat_one_label_en || "",
          ar: formData.about_page_community_stat_one_label_ar || ""
        },
        community_stat_two_number: {
          en: formData.about_page_community_stat_two_number_en || "",
          ar: formData.about_page_community_stat_two_number_ar || ""
        },
        community_stat_two_label: {
          en: formData.about_page_community_stat_two_label_en || "",
          ar: formData.about_page_community_stat_two_label_ar || ""
        },
        community_cta_title: {
          en: formData.about_page_community_cta_title_en || "",
          ar: formData.about_page_community_cta_title_ar || ""
        },
        community_cta_description: {
          en: formData.about_page_community_cta_description_en || "",
          ar: formData.about_page_community_cta_description_ar || ""
        },
        // Founder fields (1-12)
        ...Array.from({ length: 12 }, (_, i) => {
          const num = i === 0 ? "one" : i === 1 ? "two" : i === 2 ? "three" : i === 3 ? "four" : 
                      i === 4 ? "five" : i === 5 ? "six" : i === 6 ? "seven" : i === 7 ? "eight" : 
                      i === 8 ? "nine" : i === 9 ? "ten" : i === 10 ? "eleven" : "twelve";
          
          return {
            [`founder_${num}_name`]: {
              en: formData[`about_page_founder_${num}_name_en`] || "",
              ar: formData[`about_page_founder_${num}_name_ar`] || ""
            },
            [`founder_${num}_position`]: {
              en: formData[`about_page_founder_${num}_position_en`] || "",
              ar: formData[`about_page_founder_${num}_position_ar`] || ""
            },
            [`founder_${num}_sub`]: {
              en: formData[`about_page_founder_${num}_subtitle_en`] || "",
              ar: formData[`about_page_founder_${num}_subtitle_ar`] || ""
            }
          };
        }).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
        trusted_badge_one_pill: {
          en: formData.about_page_trusted_badge_one_pill_en || "",
          ar: formData.about_page_trusted_badge_one_pill_ar || ""
        },
        trusted_badge_one_text: {
          en: formData.about_page_trusted_badge_one_text_en || "",
          ar: formData.about_page_trusted_badge_one_text_ar || ""
        },
        trusted_badge_two_pill: {
          en: formData.about_page_trusted_badge_two_pill_en || "",
          ar: formData.about_page_trusted_badge_two_pill_ar || ""
        },
        trusted_badge_two_text: {
          en: formData.about_page_trusted_badge_two_text_en || "",
          ar: formData.about_page_trusted_badge_two_text_ar || ""
        },
        branches_title: {
          en: formData.about_page_branches_title_en || "",
          ar: formData.about_page_branches_title_ar || ""
        },
        branches_description: {
          en: formData.about_page_branches_description_en || "",
          ar: formData.about_page_branches_description_ar || ""
        },
        branches_cta_title: {
          en: formData.about_page_branches_cta_title_en || "",
          ar: formData.about_page_branches_cta_title_ar || ""
        },
        branches_cta_description: {
          en: formData.about_page_branches_cta_description_en || "",
          ar: formData.about_page_branches_cta_description_ar || ""
        },
        upcoming_branches_title: {
          en: formData.about_page_upcoming_branches_title_en || "",
          ar: formData.about_page_upcoming_branches_title_ar || ""
        },
        upcoming_branch_one_name: {
          en: formData.about_page_upcoming_branch_one_name_en || "",
          ar: formData.about_page_upcoming_branch_one_name_ar || ""
        },
        upcoming_branch_one_address: {
          en: formData.about_page_upcoming_branch_one_address_en || "",
          ar: formData.about_page_upcoming_branch_one_address_ar || ""
        },
        upcoming_branch_one_quarter: {
          en: formData.about_page_upcoming_branch_one_quarter_en || "",
          ar: formData.about_page_upcoming_branch_one_quarter_ar || ""
        },
        upcoming_branch_one_features: {
          en: formData.about_page_upcoming_branch_one_features_en || "",
          ar: formData.about_page_upcoming_branch_one_features_ar || ""
        },
        upcoming_branch_one_emoji: {
          en: formData.about_page_upcoming_branch_one_emoji_en || "",
          ar: formData.about_page_upcoming_branch_one_emoji_ar || ""
        },
        upcoming_branch_two_name: {
          en: formData.about_page_upcoming_branch_two_name_en || "",
          ar: formData.about_page_upcoming_branch_two_name_ar || ""
        },
        upcoming_branch_two_address: {
          en: formData.about_page_upcoming_branch_two_address_en || "",
          ar: formData.about_page_upcoming_branch_two_address_ar || ""
        },
        upcoming_branch_two_quarter: {
          en: formData.about_page_upcoming_branch_two_quarter_en || "",
          ar: formData.about_page_upcoming_branch_two_quarter_ar || ""
        },
        upcoming_branch_two_features: {
          en: formData.about_page_upcoming_branch_two_features_en || "",
          ar: formData.about_page_upcoming_branch_two_features_ar || ""
        },
        upcoming_branch_two_emoji: {
          en: formData.about_page_upcoming_branch_two_emoji_en || "",
          ar: formData.about_page_upcoming_branch_two_emoji_ar || ""
        },
        // Boolean fields (preserve existing values)
        header_status: aboutUsData?.header_status ?? true,
        header_bg: aboutUsData?.header_bg ?? "",
        content_left_status: aboutUsData?.content_left_status ?? true,
        content_right_status: aboutUsData?.content_right_status ?? true,
        top_section_image: aboutUsData?.top_section_image ?? "",
        content_middle_status: aboutUsData?.content_middle_status ?? true,
        content_middle_Img: aboutUsData?.content_middle_Img ?? "",
        founder_status: aboutUsData?.founder_status ?? true,
        founder_one_img: aboutUsData?.founder_one_img ?? "",
        founder_two_img: aboutUsData?.founder_two_img ?? "",
        founder_three_img: aboutUsData?.founder_three_img ?? "",
        founder_four_img: aboutUsData?.founder_four_img ?? "",
        founder_five_img: aboutUsData?.founder_five_img ?? "",
        founder_six_img: aboutUsData?.founder_six_img ?? "",
        branches_status: aboutUsData?.branches_status ?? true
      };

      console.log("🔍 AboutUs Payload being sent:", aboutUsPayload);

      // Submit to API
      const response = await SettingServices.updateAboutUs(aboutUsPayload);
      console.log("🔍 Update API Response:", response);

      if (response && response.data) {
        console.log("✅ About Us updated successfully");
        // Refresh data
        await fetchAboutUsData();
        setIsUpdate(true);
      } else {
        throw new Error("Failed to update About Us");
      }
    } catch (err) {
      console.error("❌ Error updating About Us:", err);
      setError("Failed to update About Us data");
    } finally {
      setSubmitting(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchAboutUsData();
  }, []);

  return {
    // Form methods
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    reset,
    
    // State
    loading,
    submitting,
    aboutUsData,
    isUpdate,
    error,
    
    // Functions
    onSubmit,
    fetchAboutUsData,
    
    // Form submission handler
    handleFormSubmit: handleSubmit(onSubmit)
  };
};

export default useAboutUs; 