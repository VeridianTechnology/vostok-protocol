import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ResearchStudies = () => (
  <section className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 bg-gradient-to-b from-black/75 via-black/60 to-black/50 px-6 py-10 md:py-16">
    <div className="absolute inset-0 hud-grid opacity-30 pointer-events-none" />
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="rounded-3xl panel-glass p-6 md:p-10">
        <p className="text-[10px] uppercase tracking-[0.35em] text-chrome/70 md:text-xs">
          Research snapshot
        </p>
        <h2 className="mt-3 text-2xl font-light tracking-tight text-foreground md:text-4xl">
          Why being hot is the way forward
        </h2>
        <p className="mt-4 text-sm text-steel md:text-base">
          This is about social currency. When you look better, people make faster, warmer
          assumptions, and those assumptions often compound into real-world outcomes. The studies
          below map how appearance can influence treatment, income, and opportunity.
        </p>
      </div>

      <div className="rounded-3xl panel-glass p-6 md:p-8">
        <Tabs defaultValue="social">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0 text-chrome/70">
            <TabsTrigger
              value="social"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-steel data-[state=active]:border-white/30 data-[state=active]:bg-white/15 data-[state=active]:text-foreground"
            >
              Social
            </TabsTrigger>
            <TabsTrigger
              value="earnings"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-steel data-[state=active]:border-white/30 data-[state=active]:bg-white/15 data-[state=active]:text-foreground"
            >
              Earnings
            </TabsTrigger>
            <TabsTrigger
              value="power"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-steel data-[state=active]:border-white/30 data-[state=active]:bg-white/15 data-[state=active]:text-foreground"
            >
              Power
            </TabsTrigger>
            <TabsTrigger
              value="legal"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-steel data-[state=active]:border-white/30 data-[state=active]:bg-white/15 data-[state=active]:text-foreground"
            >
              Legal
            </TabsTrigger>
            <TabsTrigger
              value="training"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-steel data-[state=active]:border-white/30 data-[state=active]:bg-white/15 data-[state=active]:text-foreground"
            >
              Facial training
            </TabsTrigger>
          </TabsList>

          <TabsContent value="social" className="mt-6">
            <h3 className="text-xs uppercase tracking-[0.35em] text-chrome/80">
              Social treatment and halo effects
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-steel">
              <li>
                Maxims or Myths of Beauty? (Psychological Bulletin, 2000)
                {" "}
                <a
                  href="https://pubmed.ncbi.nlm.nih.gov/10825783/"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  PubMed
                </a>
              </li>
              <li>
                What is Beautiful is Good (Dion, Berscheid, Walster, 1972)
                {" "}
                <a
                  href="https://www4.uwsp.edu/psych/s/389/dion72.pdf"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  PDF
                </a>
              </li>
              <li>
                What Is Beautiful Is Good, But… (meta-analysis, 1991)
                {" "}
                <a
                  href="https://www.scirp.org/reference/referencespapers?referenceid=4106667"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Reference
                </a>
              </li>
              <li>
                Good-looking people are not what we think (meta-analysis, 1992)
                {" "}
                <a
                  href="https://www.semanticscholar.org/paper/Good-looking-people-are-not-what-we-think.-Feingold/7a30a68c4d9534e12231a7ac95fe86c867c77566"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Semantic Scholar
                </a>
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="earnings" className="mt-6">
            <h3 className="text-xs uppercase tracking-[0.35em] text-chrome/80">
              Earnings and hiring ("beauty premium")
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-steel">
              <li>
                Beauty and the Labor Market (Hamermesh &amp; Biddle, 1994)
                {" "}
                <a
                  href="https://www.nber.org/papers/w4518"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  NBER
                </a>
              </li>
              <li>
                Why Beauty Matters (Mobius &amp; Rosenblat, 2006)
                {" "}
                <a
                  href="https://www.aeaweb.org/articles?id=10.1257/000282806776157515"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  AEA
                </a>
              </li>
              <li>
                Does it pay to be smart, attractive, or confident? (Judge et al., 2009)
                {" "}
                <a
                  href="https://www.apa.org/pubs/journals/releases/apl943742.pdf"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  PDF
                </a>
              </li>
              <li>
                Are Good-Looking People More Employable? (Ruffle &amp; Shtudiner, 2015)
                {" "}
                <a
                  href="https://pubsonline.informs.org/doi/10.1287/mnsc.2014.1927"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Management Science
                </a>
              </li>
              <li>
                Beauty Pays (Hamermesh, Princeton University Press)
                {" "}
                <a
                  href="https://nibmehub.com/opac-service/pdf/read/Beauty%20Pays%20_%20why%20attractive%20people%20are%20more%20successful.pdf"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  PDF
                </a>
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="power" className="mt-6">
            <h3 className="text-xs uppercase tracking-[0.35em] text-chrome/80">
              Power and competence impressions
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-steel">
              <li>
                Inferences of competence from faces predict election outcomes (Todorov et al., 2005)
                {" "}
                <a
                  href="https://pubmed.ncbi.nlm.nih.gov/15947187/"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  PubMed
                </a>
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="legal" className="mt-6">
            <h3 className="text-xs uppercase tracking-[0.35em] text-chrome/80">
              Legal outcomes and sentencing bias
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-steel">
              <li>
                The effect of physical appearance on judgments of guilt (Efran, 1974)
                {" "}
                <a
                  href="https://www.sciencedirect.com/science/article/abs/pii/0092656674900440"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  ScienceDirect
                </a>
              </li>
              <li>
                Mazzella &amp; Feingold meta-analysis on mock juror judgments (1994)
                {" "}
                <a
                  href="https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1559-1816.1994.tb01552.x"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Wiley
                </a>
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="training" className="mt-6">
            <h3 className="text-xs uppercase tracking-[0.35em] text-chrome/80">
              Facial training and structure (early evidence)
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-steel">
              <li>
                Association of Facial Exercise With the Appearance of Aging (JAMA Dermatology, 2018)
                {" "}
                <a
                  href="https://jamanetwork.com/journals/jamadermatology/fullarticle/2666801"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  JAMA
                </a>
              </li>
              <li>
                Masticatory muscle function and craniofacial morphology (Kiliaridis, 1986)
                {" "}
                <a
                  href="https://pubmed.ncbi.nlm.nih.gov/3465055/"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  PubMed
                </a>
              </li>
              <li>
                Masticatory muscle influence on craniofacial growth (Kiliaridis, 1995 review)
                {" "}
                <a
                  href="https://actaorthop.org/actaodontologica/article/download/39557/44744"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  PDF
                </a>
              </li>
              <li>
                Soft-diet model and mandibular changes (Kono et al., Frontiers in Physiology, 2017)
                {" "}
                <a
                  href="https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2017.00567/full"
                  className="text-ice underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Frontiers
                </a>
              </li>
            </ul>
            <p className="mt-4 text-xs text-steel/80">
              Evidence here is smaller and more mixed than the economics and social literature. Use
              it as directional, not definitive.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  </section>
);

export default ResearchStudies;
