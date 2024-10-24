import json
import psycopg2

conn = psycopg2.connect(
    dbname="mapsOfKaindorf",
    user="postgres",
    password="postgres",
    host="localhost"
)
cursor = conn.cursor()

teachers_data = [
    {
        "name": "Maria Graßmugg",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F05%2FABTDIP-GRASSMUGG_Mariagross.jpg&w=1920&q=90"
    },
    {
        "name": "Johann Wurzinger",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F01%2FDIP-WURZINGER_Johann.jpg&w=1920&q=90"
    },
    {
        "name": "Gernot Loibner",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F05%2FLoibnerGernotWeb-scaled.png&w=1920&q=90"
    },
    {
        "name": "Peter Nöhrer",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-NOeHRER_Peter.jpg&w=1920&q=90"
    },
    {
        "name": "Werner Prutsch",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FINGBED-PRUTSCH_Werner.jpg&w=1920&q=90"
    },
    {
        "name": "Konrad Wilhelm",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F05%2FINGPADBEDKONRAD_Wilhelm.jpg&w=1920&q=90"
    },
    {
        "name": "Renate Bauer",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMMADOC-BAUER_Renate-scaled.jpg&w=1200&q=90"
    },
    {
        "name": "Karin Bogensperger",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FOSTMAG-BOGENSBERGER_Karin-scaled.jpg&w=1200&q=90"
    },
    {
        "name": "Thomas Brunner",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-BRUNNER_Thomas.jpg&w=1200&q=90"
    },
    {
        "name": "Christine Chemloul",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIPDOC-CHEMLOUL_Christine.jpg&w=1200&q=90"
    },
    {
        "name": "Karl Derler",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FINGBED-DERLER_Karl.jpg&w=1200&q=90"
    },
    {
        "name": "Lukas Draxler",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIPBSC-DRAXLER_Lukas-scaled.jpg&w=1200&q=90"
    },
    {
        "name": "Manfred Ebner",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-EBNER_Manfred.jpg&w=640&q=90"
    },
    {
        "name": "Heike Eder-Skof",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-EDER_Heike-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Johannes Farmer",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIPDOC-FARMER_Johannes-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Andreas Freisinger",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2024%2F01%2FFR-Freisinger-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Gerhard Gugerbauer",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-GUGERBAUER_Gerhard.jpg&w=640&q=90"
    },
    {
        "name": "Eva-Maria Harant",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-HARANT_Eva-Maria-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Werner Harkam",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FINGDIP-HARKAM_Werner.jpg&w=640&q=90"
    },
    {
        "name": "Werner Harnisch",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-HARNISCH_Werner.jpg&w=640&q=90"
    },
    {
        "name": "Petra Heber-Körbler",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMMA-HEBER-KOeRBLER_Petra-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Marina-Elisabeth Herischko",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-HERISCHKO_Marina-Elisabeth-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Josef Hödl",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAGDIP-HOeDL_Josef.jpg&w=640&q=90"
    },
    {
        "name": "Fabian Hofferer",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2024%2F01%2FHF-Hofferer-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Christian Hofmann",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FING-HOFMANN_Christian.jpg&w=640&q=90"
    },
    {
        "name": "Gerd Holweg",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2024%2F01%2FHW-Holweg-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Iris Hugeri",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-HUGERI_Iris.jpg&w=640&q=90"
    },
    {
        "name": "Georg Huhs",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-HUHS_Georg-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Thomas Jerman",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-JERMAN_Thomas-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Miriam Jörgen",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMMA-JOeRGEN_Miriam.jpg&w=640&q=90"
    },
    {
        "name": "Kerstin Jud-Mund",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FBTH-JUD-MUND_Kerstin.jpg&w=640&q=90"
    },
    {
        "name": "Samuel Kessler",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-KESSLER_Samuel-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Thomas Knapp",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FZWEYTIK_Kurt.jpg&w=640&q=90"
    },
    {
        "name": "Markus Kohlböck",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIPBEG-KOHLBOeCK_Markus.jpg&w=640&q=90"
    },
    {
        "name": "Christoph Kohlweg",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-KOHLWEG_Christoph-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Elisabeth Krenn",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-KRENN_Elisabeth.jpg&w=640&q=90"
    },
    {
        "name": "Michael Lieschnegg",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-LIESCHNEGG_Michael.jpg&w=640&q=90"
    },
    {
        "name": "Andreas Lindner",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2024%2F01%2FLN-Lindner-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Mathias Loder-Taucher",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIPFHHBEDLODER-TAUCHER_Mathias-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Johannes Loibner",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIPBSC-LOIBNER_Johannes-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Robert Müllerferli",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-MUeLLERFERLI_Robert-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Tamara Neumeister",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2024%2F01%2FNM-Neumeister-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Peter Nöhrer",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-NOeHRER_Peter.jpg&w=640&q=90"
    },
    {
        "name": "Kerstin Obeso",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-OBESO_Kerstin-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Gottfried Pabst",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-PABST_Gottfried-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Johann Paschek",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FINGBEDMSCPASCHEK_Johann.jpg&w=640&q=90"
    },
    {
        "name": "Bettina Passath",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-PASSATH_Bettina-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Dietmar Paulus",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FINGDIPBSCPAULUS_Dietmar-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Martina Pichler",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-PICHLER_Martina-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Matthias Planinsec",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F05%2FING-PLANINSEC_Matthias.jpg&w=640&q=90"
    },
    {
        "name": "Reinhard Pongratz",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FPADBED-PONGRATZ_Reinhard.jpg&w=640&q=90"
    },
    {
        "name": "Gerhard Pretterhofer",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIPDOC-PRETTERHOFER_Gerhard.jpg&w=640&q=90"
    },
    {
        "name": "Werner Prutsch",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FINGBED-PRUTSCH_Werner.jpg&w=640&q=90"
    },
    {
        "name": "Wolfgang Reicht",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-REICHT_Wolfgang.jpg&w=640&q=90"
    },
    {
        "name": "Theresa Reischl",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-REISCHL_Theresa-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Petra Resch",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-RESCH_Petra.jpg&w=640&q=90"
    },
    {
        "name": "Verena Rexeis",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2024%2F01%2FRX-Rexeis-I-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Ursula Riesel",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-RIESEL_Ursula-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Bernd Ruff",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-RUFF_Bernd-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Michael Sammer",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F05%2FMAG-SAMMER_Michael.jpg&w=640&q=90"
    },
    {
        "name": "Heinz Schiffermüller",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIPDOC-SCHIFFERMUeLLER_Heinz-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Marcel Schnideritsch",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2024%2F01%2FST-Schnideritsch-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Gerald Schnur",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-SCHNUR_Gerald.jpg&w=640&q=90"
    },
    {
        "name": "Werner Schöfmann",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-SCHOeFMANN_Werner.jpg&w=640&q=90"
    },
    {
        "name": "Tanja Schöttl",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAGMA_BA_SCHOeTTL_Tanja-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Florian Schreiber-Valesi",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-SCHREIBER-VALESI_Florian.jpg&w=640&q=90"
    },
    {
        "name": "Eleonore Seidl",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-SEIDL_Eleonore.jpg&w=640&q=90"
    },
    {
        "name": "Reinhard Semlitsch",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FBED-SEMLITSCH_Reinhard_Jun.jpg&w=640&q=90"
    },
    {
        "name": "Sonja Sengl",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-SENGL_Sonja.jpg&w=640&q=90"
    },
    {
        "name": "Bettina Staines",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-STAINES_Bettina-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Manfred Steiner",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-STEINER_Manfred.jpg&w=640&q=90"
    },
    {
        "name": "Walter Steiner",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-STEINER_Walter.jpg&w=640&q=90"
    },
    {
        "name": "Antonia Strohmeier",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-STROHMEIER_Antonia-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Karin Strohmeier",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-STROHMEIER_Karin.jpg&w=640&q=90"
    },
    {
        "name": "Robert Strohrigl",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FStrohrigl_Robert.jpg&w=640&q=90"
    },
    {
        "name": "Christian Taucher",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FINGMMA-TAUCHER_Christian.jpg&w=640&q=90"
    },
    {
        "name": "Dagmar Taucher",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-TAUCHER_Dagmar-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Johann Tieber",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIPDOC-TIEBER_Johann-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Andrea Traumüller-Haynaly",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-TRAUMUeLLER-HAYNALY_Andrea.jpg&w=640&q=90"
    },
    {
        "name": "Esther TRKMIC",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FINGBED-TRKMIC_Esther.jpg&w=640&q=90"
    },
    {
        "name": "Reinhard Unterweger",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-UNTERWEGER_Reinhard-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Elisabeth Valesi",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-VALESI_Elisabeth-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Wolfgang Vodopiutz",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-VODOPIUTZ_Wolfgang.jpg&w=640&q=90"
    },
    {
        "name": "Dietmar Völk",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-VOeLK_Dietmar.jpg&w=640&q=90"
    },
    {
        "name": "Günter Volleritsch",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-VOLLERITSCH_Guenter.jpg&w=640&q=90"
    },
    {
        "name": "Albin Waiker",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FPADBED-WAIKER_Albin.jpg&w=640&q=90"
    },
    {
        "name": "Birgit Walzl",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-WALZL_Birgit.jpg&w=640&q=90"
    },
    {
        "name": "Ferdinand Weber",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-WEBER_Ferdinand.jpg&w=640&q=90"
    },
    {
        "name": "Martina Welser",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-WELSER_Martina-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Evelyn Wiesler",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-WIESLER_Evelyn.jpg&w=640&q=90"
    },
    {
        "name": "Manfred Wilfling",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-WILFLING_Manfred.jpg&w=640&q=90"
    },
    {
        "name": "André Wilhelm",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2024%2F01%2FWIE-WILHELM-scaled.jpg&w=640&q=90"
    },
    {
        "name": "Kurt Zweytik",
        "img_url": "https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F05%2FZWEYTIK_Kurt.jpg&w=640&q=90"
    }
]

for teacher in teachers_data:
    name = teacher['name']
    image_url = teacher['img_url']

    
    print(name)
    # Finde die teacher_id basierend auf dem Namen (vorausgesetzt, der Name ist eindeutig)
    cursor.execute("""
        UPDATE person
        SET person_id = (SELECT person_id FROM person p WHERE p.person_id = person.person_id)-1
        WHERE person.person_id >= 55
        RETURNING *
    """, (name.split()[0],name.split()[1]))

    result = cursor.fetchall()
    #print(result)
   
conn.commit()
cursor.close()
conn.close()
