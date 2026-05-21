import InterestSection from "@/components/InterestSection";

type WallSectionProps = { sectionId?: string };

const WallSection = ({ sectionId }: WallSectionProps) => (
  <InterestSection
    sectionId={sectionId}
    tabLabel="WALL"
    hideTabLabel
    lines={[]}
    desktopBackground="/section_wallpaper/wall/1_desktop.webp?v=1"
    mobileBackground="/section_wallpaper/interest/third_section.webp?v=1"
    sectionClassName="h-[150vw] min-h-0 bg-black py-0 md:h-[42.9167vw] md:min-h-0"
    mobileBackgroundPosition="center"
    mobileBackgroundSize="cover"
    mobileBackgroundScale={1}
    desktopBackgroundScale={1}
    desktopBackgroundPosition="center"
    desktopBackgroundSize="cover"
    decoration={
      <img
        src=/statues/2.webp"
        alt=""
        aria-hidden="true"
        draggable={false}
        className="pointer-events-none absolute bottom-0 right-[-18vw] z-0 block h-[82%] w-auto max-w-none -scale-x-100 object-contain md:right-[-6vw] md:h-[88%]"
      />
    }
    disableParallax
    contentClassName="flex h-full min-h-0 items-start justify-center md:max-w-none md:items-end md:justify-start"
    innerContentClassName="relative z-10 flex w-full justify-center p-0 md:justify-start md:pb-[3vh] md:pl-[10vw] md:pt-0"
  />
);

export default WallSection;
