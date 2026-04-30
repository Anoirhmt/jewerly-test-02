import React from "react";

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="min-h-screen bg-white text-black pt-48 pb-24">
      <div className="w-full px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif tracking-luxury-lg uppercase mb-16 text-center">Politique de confidentialité</h1>
        <div className="text-xs md:text-sm leading-relaxed-extra text-black/60 space-y-10 font-sans font-light">
          <section className="space-y-4">
            <p>
              Cette politique de confidentialité explique comment ELARAIN collecte, utilise et protège vos informations personnelles lorsque vous visitez notre site ou effectuez un achat.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-[10px] tracking-luxury-lg uppercase text-black font-medium">1. Données collectées</h2>
            <ul className="list-none space-y-2">
              <li className="flex items-start"><span className="w-1.5 h-[1px] bg-black/20 mt-2.5 mr-3 shrink-0" /> Informations d&apos;identification : nom, adresse, email, numéro de téléphone.</li>
              <li className="flex items-start"><span className="w-1.5 h-[1px] bg-black/20 mt-2.5 mr-3 shrink-0" /> Données de paiement : uniquement les informations nécessaires pour traiter votre transaction.</li>
              <li className="flex items-start"><span className="w-1.5 h-[1px] bg-black/20 mt-2.5 mr-3 shrink-0" /> Données de navigation : pages consultées, durée de visite, adresse IP.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-[10px] tracking-luxury-lg uppercase text-black font-medium">2. Utilisation des informations</h2>
            <ul className="list-none space-y-2">
              <li className="flex items-start"><span className="w-1.5 h-[1px] bg-black/20 mt-2.5 mr-3 shrink-0" /> Traitement et livraison de vos commandes.</li>
              <li className="flex items-start"><span className="w-1.5 h-[1px] bg-black/20 mt-2.5 mr-3 shrink-0" /> Service client et réponses à vos demandes.</li>
              <li className="flex items-start"><span className="w-1.5 h-[1px] bg-black/20 mt-2.5 mr-3 shrink-0" /> Amélioration continue de notre site et de nos offres.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-[10px] tracking-luxury-lg uppercase text-black font-medium">3. Partage des données</h2>
            <p>
              Vos informations ne sont jamais vendues. Elles ne sont partagées qu&apos;avec des prestataires de confiance (paiement, logistique) dans la stricte mesure nécessaire à l&apos;exécution de vos commandes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-[10px] tracking-luxury-lg uppercase text-black font-medium">4. Vos droits</h2>
            <ul className="list-none space-y-2">
              <li className="flex items-start"><span className="w-1.5 h-[1px] bg-black/20 mt-2.5 mr-3 shrink-0" /> Droit d&apos;accès, de rectification et de suppression de vos données.</li>
              <li className="flex items-start"><span className="w-1.5 h-[1px] bg-black/20 mt-2.5 mr-3 shrink-0" /> Droit de vous opposer au traitement.</li>
            </ul>
          </section>

          <div className="pt-12 border-t border-black/[0.03]">
            <p className="text-[9px] tracking-luxury uppercase text-black/40">Dernière mise à jour : 01/01/2026.</p>
          </div>
        </div>
      </div>
    </main>
  );
}