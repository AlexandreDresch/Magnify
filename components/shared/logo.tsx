import Image from "next/image";

export default function Logo({ isMobile }: { isMobile?: boolean }) {
  return (
    <>
      <Image
        src="/assets/images/logo.svg"
        alt="logo"
        className={`${isMobile ? "size-7" : "size-9"}`}
        width={80}
        height={28}
      />
      <span
        className={`bg-gradient-to-r from-purple-600 via-purple-500 to-purple-500 bg-clip-text ${
          isMobile ? "text-xl" : "text-2xl"
        } font-semibold text-transparent`}
      >
        MAGNIFY
      </span>
    </>
  );
}
