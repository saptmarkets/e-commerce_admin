import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@windmill/react-ui";
import { useTranslation } from "react-i18next";

//internal import
import Error from "@/components/form/others/Error";
import LabelArea from "@/components/form/selectOption/LabelArea";
import InputArea from "@/components/form/input/InputArea";
import useLoginSubmit from "@/hooks/useLoginSubmit";
import CMButton from "@/components/form/button/CMButton";

const Login = () => {
  const { t } = useTranslation();
  const { onSubmit, register, handleSubmit, errors, loading } = useLoginSubmit();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
              {t("LoginTitle")}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t("Please enter your credentials to continue")}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <LabelArea label={t("Email")} />
            <InputArea
              required={true}
              register={register}
              defaultValue="admin@gmail.com"
              label={t("Email")}
              name="email"
              type="email"
              autoComplete="username"
              placeholder={t("Email")}
            />
            <Error errorName={errors.email} />

            <div className="mt-4" />
            <LabelArea label={t("Password")} />
            <InputArea
              required={true}
              register={register}
              defaultValue="12345678"
              label={t("Password")}
              name="password"
              autocomplete="current-password"
              type="password"
              placeholder={t("Password")}
            />
            <Error errorName={errors.password} />

            {loading ? (
              <CMButton
                disabled={loading}
                type="submit"
                className={`bg-emerald-600 rounded-md mt-6 h-12 w-full`}
                to="/dashboard"
              />
            ) : (
              <Button
                disabled={loading}
                type="submit"
                className="mt-6 h-12 w-full"
                to="/dashboard"
              >
                {t("LoginTitle")}
              </Button>
            )}
          </form>

          <div className="mt-6 flex items-center justify-between text-sm">
            <Link
              className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
              to="/forgot-password"
            >
              {t("ForgotPassword")}
            </Link>
            <Link
              className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
              to="/signup"
            >
              {t("CreateAccountTitle")}
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} SAPT Markets
        </p>
      </div>
    </div>
  );
};

export default Login;
