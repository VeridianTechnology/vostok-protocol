import InterestSection from "@/components/InterestSection";

type MessianicSectionProps = { sectionId?: string };

const MessianicSection = ({ sectionId }: MessianicSectionProps) => (
  <InterestSection
    sectionId={sectionId}
    tabLabel="STAY TUNED"
    hideTabLabel
    lines={[]}
    desktopBackground="/section_wallpaper/interest/new_desktop.jpg?v=3"
    mobileBackground="/section_wallpaper/interest/new_mobile.jpg?v=1"
    sectionClassName="-mt-[8vh] min-h-[72vh] mb-0 bg-black pt-0 pb-0 md:mt-0 md:mb-0 md:min-h-[90vh] md:pt-0 md:pb-[3.5rem]"
    tabLabelClassName="min-w-[15.5rem] px-8 text-center tracking-[0.34em] md:min-w-[18.5rem] md:px-10"
    mobileBackgroundPosition="58% 72%"
    mobileBackgroundSize="cover"
    mobileBackgroundScale={1}
    desktopBackgroundScale={1}
    desktopBackgroundPosition="55% 28%"
    secondaryOverlaySrc="/section_wallpaper/interest/02.png?v=1"
    secondaryOverlayPosition="right"
    secondaryOverlayClassName="bottom-[-9vh] right-[-46vw] hidden h-[82%] -rotate-[25deg] opacity-100 md:top-0 md:right-[-14vw] md:block md:h-full"
    backgroundOverlayClassName="bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.03)_32%,rgba(0,0,0,0.12)_62%,rgba(0,0,0,0.46)_100%)]"
    disableParallax
    contentClassName="flex min-h-[72vh] flex-col items-center justify-center md:min-h-[calc(90vh-7.75rem)] md:max-w-none md:items-start md:justify-end"
    innerContentClassName="flex w-full items-center justify-center px-[6vw] pb-0 pt-0 md:items-end md:justify-start md:px-0 md:pb-[6vh] md:pl-[10vw] md:pt-0"
  />
);

export default MessianicSection;
