from weasyprint import HTML
import requests

# Configuration
URL = "https://votre-username.github.io/votre-repo/"  # Votre page GitHub
PDF_FILE = "page.pdf"  # Nom du fichier PDF généré

# Génération du PDF
def generate_pdf():
    # Récupère le contenu HTML
    response = requests.get(URL)
    html = HTML(string=response.text)
    
    # Configuration du PDF
    css = "@page { size: A4; margin: 2cm; }"
    
    # Génération
    html.write_pdf(
        PDF_FILE,
        stylesheets=[string=css)],
        presentational_hints=True
    )

if __name__ == "__main__":
    generate_pdf()
    print(f"PDF généré : {PDF_FILE}")
