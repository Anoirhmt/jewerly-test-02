export default function PolitiqueExpeditionPage() {
  return (
    <div className="container mx-auto px-6 py-16 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-serif font-bold mb-8 text-black">Politique d'Expédition</h1>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p className="text-lg text-gray-600 mb-8">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold mb-4 text-black">1. Zones de Livraison</h2>
            <p>Nous livrons actuellement dans tout le Maroc. Les principales villes couvertes incluent :</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-gray-50 p-3 rounded">Casablanca</div>
              <div className="bg-gray-50 p-3 rounded">Rabat</div>
              <div className="bg-gray-50 p-3 rounded">Marrakech</div>
              <div className="bg-gray-50 p-3 rounded">Fès</div>
              <div className="bg-gray-50 p-3 rounded">Tanger</div>
              <div className="bg-gray-50 p-3 rounded">Agadir</div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold mb-4 text-black">2. Délais de Livraison</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-black pl-4">
                <h3 className="font-semibold">Grandes Villes (Casablanca, Rabat, Marrakech)</h3>
                <p>1-2 jours ouvrables</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-semibold">Autres Villes</h3>
                <p>2-4 jours ouvrables</p>
              </div>
              <div className="border-l-4 border-gray-300 pl-4">
                <h3 className="font-semibold">Zones Rurales</h3>
                <p>3-5 jours ouvrables</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold mb-4 text-black">3. Frais de Livraison</h2>
            <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-800 mb-2">🚚 Livraison Gratuite</h3>
              <p className="text-green-700">
                Profitez de la livraison gratuite sur toutes vos commandes, peu importe le montant !
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold mb-4 text-black">4. Paiement à la Livraison</h2>
            <p>
              Nous acceptons le paiement en espèces à la livraison. Notre livreur vous contactera avant la livraison
              pour confirmer votre disponibilité.
            </p>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
              <p className="text-blue-800">
                <strong>💡 Conseil :</strong> Préparez le montant exact pour faciliter la transaction.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold mb-4 text-black">5. Emballage Sécurisé</h2>
            <p>Tous nos bijoux sont soigneusement emballés dans :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Boîtes à bijoux élégantes et sécurisées</li>
              <li>Emballage de protection anti-choc</li>
              <li>Certificat d'authenticité inclus</li>
              <li>Emballage discret pour votre confidentialité</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold mb-4 text-black">6. Suivi de Commande</h2>
            <p>Une fois votre commande expédiée, vous recevrez :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Un SMS de confirmation avec le numéro de suivi</li>
              <li>Le numéro de téléphone du livreur</li>
              <li>Une estimation précise de l'heure de livraison</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold mb-4 text-black">7. Contact Livraison</h2>
            <p>Pour toute question concernant votre livraison :</p>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <p>
                <strong>WhatsApp :</strong> +212 6 12 34 56 78
              </p>
              <p>
                <strong>Email :</strong> livraison@elarain-jewelry.com
              </p>
              <p>
                <strong>Horaires :</strong> 9h00 - 18h00 (Lun-Sam)
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
