export default function PolitiqueRemboursementPage() {
  return (
    <div className="container mx-auto px-6 py-16 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-serif font-bold mb-8 text-black">Politique de Remboursement</h1>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p className="text-lg text-gray-600 mb-8">Dernière mise à jour : 01/07/2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold mb-4 text-black">1. Période de Retour</h2>
            <p>
              Vous disposez de <strong>10 jours</strong> à compter de la réception de votre commande pour retourner vos
              bijoux. Les articles doivent être dans leur état d'origine, non portés et dans leur emballage d'origine.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold mb-4 text-black">2. Conditions de Retour</h2>
            <p>Pour être éligible à un retour, votre article doit respecter les conditions suivantes :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Être dans son état d'origine, non porté et non endommagé</li>
              <li>Être dans son emballage d'origine avec tous les accessoires</li>
              <li>Être retourné dans les 10 jours suivant la livraison</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold mb-4 text-black">3. Processus de Retour</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="font-semibold">Contactez-nous</h3>
                  <p>Envoyez un email à returns@elarain-jewelry.com avec votre numéro de commande</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="font-semibold">Recevez l'autorisation</h3>
                  <p>Nous vous enverrons un numéro d'autorisation de retour (RMA)</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="font-semibold">Expédiez l'article</h3>
                  <p>Renvoyez l'article avec le numéro RMA dans un emballage sécurisé</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold mb-4 text-black">4. Remboursements</h2>
            <p>
              Une fois votre retour reçu et inspecté, nous vous enverrons un email pour vous notifier que nous avons
              reçu votre article retourné. Le remboursement sera traité dans un délai de{" "}
              <strong>5-7 jours ouvrables</strong> sur votre méthode de paiement originale.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold mb-4 text-black">5. Frais de Retour</h2>
            <p>
              Les frais de retour sont à la charge du client, sauf en cas d'erreur de notre part ou d'article
              défectueux. Nous recommandons l'utilisation d'un service de livraison avec suivi et assurance.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
