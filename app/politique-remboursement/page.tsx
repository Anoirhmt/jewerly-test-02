import React from "react";

export default function PolitiqueRemboursementPage() {
  return (
    <main className="min-h-screen bg-white text-black pt-48 pb-24">
      <div className="w-full px-6 max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif tracking-luxury-lg uppercase mb-16 text-center">Politique de remboursement</h1>
        <div className="text-xs md:text-sm leading-relaxed-extra text-black/60 space-y-10 font-sans font-light">
          <section className="space-y-4">
            <p>
              Chez ELARAIN, aucun remboursement n&apos;est accepté après la livraison de votre commande.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-[10px] tracking-luxury-lg uppercase text-black font-medium">Conditions d&apos;échange</h2>
            <p>Nous nous engageons à vous échanger votre article dans les cas suivants&nbsp;:</p>
            <ul className="list-none space-y-2">
              <li className="flex items-start"><span className="w-1.5 h-[1px] bg-black/20 mt-2.5 mr-3 shrink-0" /> Le produit est arrivé endommagé.</li>
              <li className="flex items-start"><span className="w-1.5 h-[1px] bg-black/20 mt-2.5 mr-3 shrink-0" /> Il y a eu une erreur de modèle ou de couleur de notre part.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-[10px] tracking-luxury-lg uppercase text-black font-medium">Procédure</h2>
            <p>Veuillez nous contacter dans un délai de 48&nbsp;heures après réception avec&nbsp;:</p>
            <ul className="list-none space-y-2">
              <li className="flex items-start"><span className="w-1.5 h-[1px] bg-black/20 mt-2.5 mr-3 shrink-0" /> Une photo du produit concerné.</li>
              <li className="flex items-start"><span className="w-1.5 h-[1px] bg-black/20 mt-2.5 mr-3 shrink-0" /> Votre numéro de commande.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-[10px] tracking-luxury-lg uppercase text-black font-medium">Exceptions</h2>
            <p>Aucun échange ne sera accepté si&nbsp;:</p>
            <ul className="list-none space-y-2">
              <li className="flex items-start"><span className="w-1.5 h-[1px] bg-black/20 mt-2.5 mr-3 shrink-0" /> L&apos;article a été utilisé.</li>
              <li className="flex items-start"><span className="w-1.5 h-[1px] bg-black/20 mt-2.5 mr-3 shrink-0" /> La demande dépasse le délai indiqué.</li>
              <li className="flex items-start"><span className="w-1.5 h-[1px] bg-black/20 mt-2.5 mr-3 shrink-0" /> L&apos;erreur provient d&apos;une mauvaise sélection lors de la commande.</li>
            </ul>
          </section>

          <div className="pt-12 border-t border-black/[0.03]">
            <p className="text-[9px] tracking-luxury uppercase text-black/40">Nous vous remercions pour votre confiance.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
