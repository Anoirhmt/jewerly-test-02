import React from "react";

export default function ConditionsUtilisationPage() {
  return (
    <main className="min-h-screen bg-white text-black pt-48 pb-24">
      <div className="w-full px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif tracking-luxury-lg uppercase mb-16 text-center">Conditions d&apos;utilisation</h1>
        <div className="text-xs md:text-sm leading-relaxed-extra text-black/60 space-y-10 font-sans font-light">
          <section className="space-y-4">
            <p>
              En accédant au site ELARAIN ou en effectuant un achat, vous acceptez les présentes conditions d&apos;utilisation.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-[10px] tracking-luxury-lg uppercase text-black font-medium">1. Utilisation du site</h2>
            <ul className="list-none space-y-2">
              <li className="flex items-start"><span className="w-1.5 h-[1px] bg-black/20 mt-2.5 mr-3 shrink-0" /> Vous vous engagez à ne pas utiliser le site à des fins illégales ou non autorisées.</li>
              <li className="flex items-start"><span className="w-1.5 h-[1px] bg-black/20 mt-2.5 mr-3 shrink-0" /> Vous acceptez de ne pas perturber le fonctionnement du site ni d&apos;en compromettre la sécurité.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-[10px] tracking-luxury-lg uppercase text-black font-medium">2. Propriété intellectuelle</h2>
            <p>
              Tous les contenus présents sur le site (textes, images, marques et logos) sont la propriété exclusive d&apos;ELARAIN ou de ses partenaires. Toute reproduction ou utilisation sans autorisation écrite est strictement interdite.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-[10px] tracking-luxury-lg uppercase text-black font-medium">3. Limitation de responsabilité</h2>
            <p>
              ELARAIN ne pourra être tenu responsable des dommages directs ou indirects résultant de l&apos;utilisation ou de l&apos;impossibilité d&apos;utiliser le site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-[10px] tracking-luxury-lg uppercase text-black font-medium">4. Modifications</h2>
            <p>
              ELARAIN se réserve le droit de modifier ces conditions à tout moment. Les nouvelles conditions seront publiées sur cette page.
            </p>
          </section>

          <div className="pt-12 border-t border-black/[0.03]">
            <p className="text-[9px] tracking-luxury uppercase text-black/40">Dernière mise à jour : 01/01/2026.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
