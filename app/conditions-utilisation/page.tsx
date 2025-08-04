export default function ConditionsUtilisationPage() {
  return (
    <div className="container mx-auto px-6 py-16 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-serif font-bold mb-8 text-black">Conditions d'Utilisation</h1>
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p className="text-lg text-gray-600 mb-8">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold mb-4 text-black">1. Acceptation des Conditions</h2>
            <p>
              En accédant et en utilisant le site web d'Elarain Jewelry, vous acceptez d'être lié par ces conditions
              d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold mb-4 text-black">2. Utilisation du Site</h2>
            <p>Vous vous engagez à utiliser notre site uniquement à des fins légales et de manière à ne pas :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Violer les droits d'autrui</li>
              <li>Transmettre du contenu illégal, nuisible ou offensant</li>
              <li>Tenter d'accéder de manière non autorisée à notre système</li>
              <li>Interférer avec le fonctionnement normal du site</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold mb-4 text-black">3. Commandes et Paiements</h2>
            <p>
              Toutes les commandes sont soumises à notre acceptation. Nous nous réservons le droit de refuser ou
              d'annuler toute commande pour quelque raison que ce soit. Les prix sont indiqués en dirhams marocains (DH)
              et incluent toutes les taxes applicables.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold mb-4 text-black">4. Propriété Intellectuelle</h2>
            <p>
              Tout le contenu de ce site, y compris les textes, images, logos, et designs, est protégé par les droits
              d'auteur et autres droits de propriété intellectuelle. Vous ne pouvez pas reproduire, distribuer ou
              utiliser ce contenu sans notre autorisation écrite.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold mb-4 text-black">5. Limitation de Responsabilité</h2>
            <p>
              Elarain Jewelry ne sera pas responsable des dommages indirects, accessoires ou consécutifs résultant de
              l'utilisation de notre site ou de nos produits. Notre responsabilité totale ne dépassera pas le montant
              payé pour le produit concerné.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold mb-4 text-black">6. Modifications</h2>
            <p>
              Nous nous réservons le droit de modifier ces conditions d'utilisation à tout moment. Les modifications
              prendront effet dès leur publication sur le site. Il est de votre responsabilité de consulter
              régulièrement ces conditions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-serif font-semibold mb-4 text-black">7. Droit Applicable</h2>
            <p>
              Ces conditions d'utilisation sont régies par le droit marocain. Tout litige sera soumis à la juridiction
              exclusive des tribunaux de Casablanca, Maroc.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
