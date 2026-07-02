elif page == "Oliviers en bonne santé":
    st.header("🌿 Oliviers en bonne santé")

    healthy_images = [
        "images/healthy23.jpg",
        "images/healthy24.jpg",
        "images/healthy25.jpg",
        "images/healthy26.jpg",
        "images/healthy27.jpg",
        "images/healthy28.jpg",
        "images/healthy29.jpg",
        "images/healthy30.jpg"
    ]

    cols = st.columns(3)

    for i, img in enumerate(healthy_images):
        with cols[i % 3]:
            st.image(img, use_container_width=True)

    st.subheader("Description")

    st.write("""
    Les oliviers en bonne santé présentent :

    • Des feuilles vertes et brillantes.
    • Un tronc solide sans fissures.
    • Une croissance régulière.
    • Des fruits sains sans taches ni déformations.
    • Aucune présence de champignons ou d'insectes nuisibles.

    Pour maintenir leur bonne santé :
    - Irrigation adaptée.
    - Taille régulière.
    - Fertilisation équilibrée.
    - Surveillance des maladies et ravageurs.
    """)