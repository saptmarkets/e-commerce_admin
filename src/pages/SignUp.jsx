import React from "react";
import { Link } from "react-router-dom";
import { Input, Label, Button } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";

//internal import
import Error from "@/components/form/others/Error";
import InputArea from "@/components/form/input/InputArea";
import LabelArea from "@/components/form/selectOption/LabelArea";
import SelectRole from "@/components/form/selectOption/SelectRole";
import useLoginSubmit from "@/hooks/useLoginSubmit";

const SignUp = () => {
  const { t } = useTranslation();
  const { onSubmit, register, handleSubmit, errors, loading } = useLoginSubmit();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-900 px-4">
      <div className="w-full max-w-lg">
        <div className="backdrop-blur bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
              {t("CreateAccountTitle")}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t("Please enter your credentials to continue")}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <LabelArea label={t("Name")} />
            <InputArea
              required
              register={register}
              label={t("Name")}
              name="name"
              type="text"
              placeholder={t("Name")}
            />
            <Error errorName={errors.name} />

            <LabelArea label={t("Email")} />
            <InputArea
              required
              register={register}
              label={t("Email")}
              name="email"
              type="email"
              placeholder={t("Email")}
            />
            <Error errorName={errors.email} />

            <LabelArea label={t("Password")} />
            <InputArea
              required
              register={register}
              label={t("Password")}
              name="password"
              type="password"
              autocomplete="current-password"
              placeholder={t("Password")}
            />
            <Error errorName={errors.password} />

            <LabelArea label={t("StaffRole")} />
            <div className="col-span-8 sm:col-span-4">
              <SelectRole register={register} label={t("StaffRole")} name="role" />
              <Error errorName={errors.role} />
            </div>

            <Label className="mt-6" check>
              <Input type="checkbox" />
              <span className="ml-2">
                {t("Iagree")} <span className="underline">{t("privacyPolicy")}</span>
              </span>
            </Label>

            <Button disabled={loading} type="submit" className="mt-6 h-12 w-full" to="/dashboard" block>
              {t("CreateAccountTitle")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline" to="/login">
              {t("AlreadyAccount")}
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">© {new Date().getFullYear()} SAPT Markets</p>
      </div>
    </div>
  );
};

export default SignUp;
