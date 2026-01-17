import React from "react";

export default function PolitiqueExpeditionPage() {
  return (
    <main className="min-h-screen bg-white text-black pt-48 pb-24">
      <div className="w-full px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif tracking-luxury-lg uppercase mb-16 text-center">Politique d'expédition</h1>
        <div className="text-xs md:text-sm leading-relaxed-extra text-black/60 space-y-10 font-sans font-light">
          <section className="space-y-4">
            <p>
              Cette politique d'expédition décrit nos modes de livraison, les délais estimés et les frais applicables pour vos commandes ELARAIN.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-[10px] tracking-luxury-lg uppercase text-black font-medium">1. Zones de livraison</h2>
            <p>Nous livrons exclusivement sur l'ensemble du territoire marocain.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-[10px] tracking-luxury-lg uppercase text-black font-medium">2. Délais de traitement</h2>
            <p>
              Toutes les commandes sont traitées avec le plus grand soin. Le délai de livraison estimé est de 24 à 48 heures ouvrées après validation de votre commande.
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
