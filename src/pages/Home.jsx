import {
  Hero,
  WelcomeSection,
  QuickLinksSection,
  OfertaEducativaSection,
  InstalacionesSection,
  StatsSection,
  ContactPreview,
  FAQSection
} from '../components';

export const Home = () => {
  return (
    <div className="text-justify">
      <Hero />
      <WelcomeSection />
      <QuickLinksSection />
      <OfertaEducativaSection />
      <InstalacionesSection />
      <StatsSection />
      <FAQSection />
    </div>
  );
};
