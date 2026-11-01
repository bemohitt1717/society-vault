import { Button, Spinner } from "@heroui/react";

const AuthSubmitButton = ({
  icon: Icon,
  label,
  loadingLabel,
  isLoading = false,
}) => (
  <Button
    type="submit"
    fullWidth
    size="lg"
    isDisabled={isLoading}
    className="w-full cursor-pointer rounded-xl bg-[#7659d9] px-5 py-3.5 font-semibold text-white transition duration-200 hover:bg-[#8368e2] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b9a8ff]"
  >
    <span className="inline-flex items-center justify-center gap-2">
      {isLoading ? (
        <Spinner color="current" size="sm" />
      ) : (
        <Icon aria-hidden="true" className="size-[17px]" strokeWidth={1.8} />
      )}
      <span>{isLoading ? loadingLabel : label}</span>
    </span>
  </Button>
);

export default AuthSubmitButton;
