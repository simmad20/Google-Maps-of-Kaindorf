--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2
-- Dumped by pg_dump version 16.2

-- Started on 2025-03-31 09:01:07

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 41751)
-- Name: address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.address (
    address_id bigint NOT NULL,
    street character varying(200),
    housenumber integer,
    plz integer
);


ALTER TABLE public.address OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 41754)
-- Name: building; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.building (
    building_id bigint NOT NULL,
    address_id integer,
    name character varying(100) NOT NULL
);


ALTER TABLE public.building OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 41757)
-- Name: building_building_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.building ALTER COLUMN building_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.building_building_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 218 (class 1259 OID 41758)
-- Name: department; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.department (
    department_id bigint NOT NULL,
    name character varying(50) NOT NULL,
    abbreviation character varying(15) NOT NULL
);


ALTER TABLE public.department OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 41761)
-- Name: department_department_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.department ALTER COLUMN department_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.department_department_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 220 (class 1259 OID 41762)
-- Name: person; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.person (
    person_id bigint NOT NULL,
    firstname character varying(100) NOT NULL,
    lastname character varying(100) NOT NULL
);


ALTER TABLE public.person OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 41765)
-- Name: person_person_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.person ALTER COLUMN person_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.person_person_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 222 (class 1259 OID 41766)
-- Name: room; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.room (
    room_id bigint NOT NULL,
    room_number character varying(10) NOT NULL,
    name character varying(300),
    x integer,
    y integer,
    width integer,
    height integer,
    building_id integer
);


ALTER TABLE public.room OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 41769)
-- Name: room_room_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.room_room_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.room_room_id_seq OWNER TO postgres;

--
-- TOC entry 4905 (class 0 OID 0)
-- Dependencies: 223
-- Name: room_room_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.room_room_id_seq OWNED BY public.room.room_id;


--
-- TOC entry 224 (class 1259 OID 41770)
-- Name: room_room_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.room ALTER COLUMN room_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.room_room_id_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 225 (class 1259 OID 41771)
-- Name: school_room; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.school_room (
    room_id bigint NOT NULL,
    indicator character varying(15),
    teacher_id bigint NOT NULL,
    valid_from date NOT NULL
);


ALTER TABLE public.school_room OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 41774)
-- Name: schoolclass; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schoolclass (
    schoolclass_id bigint NOT NULL,
    year integer NOT NULL,
    department_id integer,
    classteacher_id integer,
    classdeputy_id integer
);


ALTER TABLE public.schoolclass OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 41777)
-- Name: schoolclass_schoolclass_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.schoolclass ALTER COLUMN schoolclass_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.schoolclass_schoolclass_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 228 (class 1259 OID 41778)
-- Name: teacher; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teacher (
    teacher_id bigint NOT NULL,
    abbreviation character varying(3),
    image_url character varying(48000),
    title character varying(100)
);


ALTER TABLE public.teacher OWNER TO postgres;

--
-- TOC entry 4886 (class 0 OID 41751)
-- Dependencies: 215
-- Data for Name: address; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.address (address_id, street, housenumber, plz) FROM stdin;
1	Grazer Straße	202	8430
\.


--
-- TOC entry 4887 (class 0 OID 41754)
-- Dependencies: 216
-- Data for Name: building; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.building (building_id, address_id, name) FROM stdin;
1	1	HTBLA Kaindorf
\.


--
-- TOC entry 4889 (class 0 OID 41758)
-- Dependencies: 218
-- Data for Name: department; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.department (department_id, name, abbreviation) FROM stdin;
\.


--
-- TOC entry 4891 (class 0 OID 41762)
-- Dependencies: 220
-- Data for Name: person; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.person (person_id, firstname, lastname) FROM stdin;
1	Maria	Graßmugg
2	Johann	Wurzinger
3	Gernot	Loibner
6	Konrad	Wilhelm
8	Karin	Bogensperger
13	Manfred	Ebner
14	Heike	Eder-Skof
15	Johannes	Farmer
16	Andreas	Freisinger
17	Gerhard	Gugerbauer
18	Eva-Maria	Harant
19	Werner	Harkam
20	Werner	Harnisch
21	Petra	Heber-Körbler
22	Marina-Elisabeth	Herischko
23	Josef	Hödl
24	Fabian	Hofferer
27	Iris	Hugeri
28	Georg	Huhs
29	Thomas	Jerman
30	Miriam	Jörgen
31	Kerstin	Jud-Mund
32	Samuel	Kessler
33	Thomas	Knapp
34	Markus	Kohlböck
35	Christoph	Kohlweg
36	Elisabeth	Krenn
37	Michael	Lieschnegg
38	Andreas	Lindner
39	Mathias	Loder-Taucher
40	Johannes	Loibner
41	Robert	Müllerferli
42	Tamara	Neumeister
43	Peter	Nöhrer
44	Kerstin	Obeso
45	Gottfried	Pabst
46	Johann	Paschek
47	Bettina	Passath
48	Dietmar	Paulus
49	Martina	Pichler
50	Matthias	Planinsec
51	Reinhard	Pongratz
52	Gerhard	Pretterhofer
53	Werner	Prutsch
55	Wolfgang	Reicht
56	Theresa	Reischl
57	Petra	Resch
58	Verena	Rexeis
59	Ursula	Riesel
60	Bernd	Ruff
61	Michael	Sammer
62	Heinz	Schiffermüller
63	Marcel	Schnideritsch
64	Gerald	Schnur
65	Werner	Schöfmann
66	Tanja	Schöttl
67	Florian	Schreiber-Valesi
68	Eleonore	Seidl
69	Reinhard	Semlitsch
70	Sonja	Sengl
71	Bettina	Staines
72	Manfred	Steiner
73	Walter	Steiner
74	Antonia	Strohmeier
75	Karin	Strohmeier
76	Robert	Strohrigl
77	Christian	Taucher
78	Dagmar	Taucher
79	Johann	Tieber
80	Andrea	Traumüller-Haynaly
81	Esther	TRKMIC
82	Reinhard	Unterweger
83	Elisabeth	Valesi
84	Wolfgang	Vodopiutz
85	Dietmar	Völk
86	Günter	Volleritsch
87	Albin	Waiker
88	Birgit	Walzl
89	Ferdinand	Weber
90	Martina	Welser
91	Evelyn	Wiesler
92	Manfred	Wilfling
93	André	Wilhelm
94	Kurt	Zweytik
96	karen	hausner
98	test	test
7	Renate	Bauer
99	Franca	Harzl
10	Christine	Chemloul
9	Thomas	Brunner
12	Lukas	Draxler
11	Karl	Derler
25	Christian	Hofmann
26	Gerd	Holweg
\.


--
-- TOC entry 4893 (class 0 OID 41766)
-- Dependencies: 222
-- Data for Name: room; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.room (room_id, room_number, name, x, y, width, height, building_id) FROM stdin;
6	1.8.2	\N	193	179	16	19	1
4	1.13.6	\N	116	163	16	19	1
8	1.12.1	\N	437	184	15	20	1
10	1.3	\N	843	181	17	18	1
5	1.12.3	\N	1613	168	4	19	1
3	1.13.7	\N	45	162	19	19	1
9	9.1.3	\N	717	176	13	19	1
7	1.8.1	\N	313	183	16	19	1
11	1.1.17	Werkstatt	435	78	15	15	1
\.


--
-- TOC entry 4896 (class 0 OID 41771)
-- Dependencies: 225
-- Data for Name: school_room; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.school_room (room_id, indicator, teacher_id, valid_from) FROM stdin;
4	\N	20	2025-02-27
\.


--
-- TOC entry 4897 (class 0 OID 41774)
-- Dependencies: 226
-- Data for Name: schoolclass; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schoolclass (schoolclass_id, year, department_id, classteacher_id, classdeputy_id) FROM stdin;
\.


--
-- TOC entry 4899 (class 0 OID 41778)
-- Dependencies: 228
-- Data for Name: teacher; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teacher (teacher_id, abbreviation, image_url, title) FROM stdin;
14	ED	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-EDER_Heike-scaled.jpg&w=640&q=90	Mag.a
18	HN	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-HARANT_Eva-Maria-scaled.jpg&w=640&q=90	Mag.a
16	FR	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2024%2F01%2FFR-Freisinger-scaled.jpg&w=640&q=90	\N
20	HA	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-HARNISCH_Werner.jpg&w=640&q=90	Dipl.-Ing.
22	HR	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-HERISCHKO_Marina-Elisabeth-scaled.jpg&w=640&q=90	Mag.a
38	LN	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2024%2F01%2FLN-Lindner-scaled.jpg&w=640&q=90	Dipl.-Ing. (FH)
28	HS	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-HUHS_Georg-scaled.jpg&w=640&q=90	Dipl.-Ing.
30	JM	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMMA-JOeRGEN_Miriam.jpg&w=640&q=90	MMag.a
27	HU	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-HUGERI_Iris.jpg&w=640&q=90	Mag.a
31	JK	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FBTH-JUD-MUND_Kerstin.jpg&w=640&q=90	BTh
24	HF	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2024%2F01%2FHF-Hofferer-scaled.jpg&w=640&q=90	\N
53	PRU	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FINGBED-PRUTSCH_Werner.jpg&w=640&q=90	Ing.
36	KR	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-KRENN_Elisabeth.jpg&w=640&q=90	Mag.a
29	JR	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-JERMAN_Thomas-scaled.jpg&w=640&q=90	Dipl.-Ing.
32	KE	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-KESSLER_Samuel-scaled.jpg&w=640&q=90	Dipl.-Ing.
23	HX	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAGDIP-HOeDL_Josef.jpg&w=640&q=90	Mag. Dipl.-Ing.
33	KP	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FZWEYTIK_Kurt.jpg&w=640&q=90	Ing. Dipl.-Ing. Dipl.-Ing. (FH)
34	KL	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIPBEG-KOHLBOeCK_Markus.jpg&w=640&q=90	Dipl.-Ing.
21	HB	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMMA-HEBER-KOeRBLER_Petra-scaled.jpg&w=640&q=90	MMag.a
35	KW	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-KOHLWEG_Christoph-scaled.jpg&w=640&q=90	Dipl.-Ing.
37	LI	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-LIESCHNEGG_Michael.jpg&w=640&q=90	Dipl.-Ing.
15	FA	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIPDOC-FARMER_Johannes-scaled.jpg&w=640&q=90	Dipl.-Ing. Dr.
43	NO	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-NOeHRER_Peter.jpg&w=640&q=90	Dipl.-Ing.
6	WIL	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F05%2FINGPADBEDKONRAD_Wilhelm.jpg&w=1920&q=90	Ing. Dipl.-Päd.
13	EB	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-EBNER_Manfred.jpg&w=640&q=90	Mag.
3	LB	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F05%2FLoibnerGernotWeb-scaled.png&w=1920&q=90	Dipl.-Ing.
19	HK	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FINGDIP-HARKAM_Werner.jpg&w=640&q=90	Ing. Dipl.-Ing.
17	GU	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-GUGERBAUER_Gerhard.jpg&w=640&q=90	Dipl.-Ing.
2	WU	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F01%2FDIP-WURZINGER_Johann.jpg&w=1920&q=90	Dipl.-Ing.
57	RP	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-RESCH_Petra.jpg&w=1200&q=90	Mag.a
58	RX	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2024%2F01%2FRX-Rexeis-I-scaled.jpg&w=1200&q=90	Mag.a
10	CL	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIPDOC-CHEMLOUL_Christine.jpg&w=1200&q=90	Dipl.-Ing.in Dr.in
9	BN	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-BRUNNER_Thomas.jpg&w=1200&q=90	Dipl.-Ing.
12	DX	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIPBSC-DRAXLER_Lukas-scaled.jpg&w=1200&q=90	Dipl.-Ing.
78	TD	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-TAUCHER_Dagmar-scaled.jpg&w=1200&q=90	Mag.a
25	HOF	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FING-HOFMANN_Christian.jpg&w=640&q=90	Ing.
26	HW	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2024%2F01%2FHW-Holweg-scaled.jpg&w=640&q=90	Dipl.-Ing. Dr.
59	RI	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-RIESEL_Ursula-scaled.jpg&w=1200&q=90	Dipl.-Ing.in
60	RU	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-RUFF_Bernd-scaled.jpg&w=1200&q=90	Mag.
61	SA	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F05%2FMAG-SAMMER_Michael.jpg&w=1200&q=90	Mag.
62	SF	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIPDOC-SCHIFFERMUeLLER_Heinz-scaled.jpg&w=1200&q=90	Dipl.-Ing. Dr.
63	ST	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2024%2F01%2FST-Schnideritsch-scaled.jpg&w=1200&q=90	\N
83	VA	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-VALESI_Elisabeth-scaled.jpg&w=1200&q=90	Mag.a
64	SR	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-SCHNUR_Gerald.jpg&w=1200&q=90	Dipl.-Ing.
88	WL	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-WALZL_Birgit.jpg&w=1200&q=90	Mag.a
92	WI	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-WILFLING_Manfred.jpg&w=1200&q=90	Dipl.-Ing.
74	SI	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-STROHMEIER_Antonia-scaled.jpg&w=1200&q=90	Mag.a
65	SH	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-SCHOeFMANN_Werner.jpg&w=1200&q=90	Dipl.-Ing.
66	SY	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAGMA_BA_SCHOeTTL_Tanja-scaled.jpg&w=1200&q=90	Mag.a
67	SC	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-SCHREIBER-VALESI_Florian.jpg&w=1200&q=90	Dipl.-Ing. (FH)
68	SD	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-SEIDL_Eleonore.jpg&w=1200&q=90	Mag.a
8	BO	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FOSTMAG-BOGENSBERGER_Karin-scaled.jpg&w=1200&q=90	OStR.in Mag.a
46	PAS	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FINGBEDMSCPASCHEK_Johann.jpg&w=640&q=90	Ing.
50	PLA	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F05%2FING-PLANINSEC_Matthias.jpg&w=640&q=90	Ing.
45	PA	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-PABST_Gottfried-scaled.jpg&w=640&q=90	Mag.
69	SEL	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FBED-SEMLITSCH_Reinhard_Jun.jpg&w=1200&q=90	BEd
71	SB	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-STAINES_Bettina-scaled.jpg&w=1200&q=90	Mag.a
44	OS	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-OBESO_Kerstin-scaled.jpg&w=640&q=90	Mag.a
47	PS	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-PASSATH_Bettina-scaled.jpg&w=640&q=90	Mag.a
49	PL	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-PICHLER_Martina-scaled.jpg&w=640&q=90	Mag.a
42	NM	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2024%2F01%2FNM-Neumeister-scaled.jpg&w=640&q=90	\N
52	PH	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIPDOC-PRETTERHOFER_Gerhard.jpg&w=640&q=90	Dipl.-Ing. Dr.
48	PD	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FINGDIPBSCPAULUS_Dietmar-scaled.jpg&w=640&q=90	Ing. Dipl.-Ing.
39	LT	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIPFHHBEDLODER-TAUCHER_Mathias-scaled.jpg&w=640&q=90	Dipl.-Ing. (FH)
51	PON	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FPADBED-PONGRATZ_Reinhard.jpg&w=640&q=90	Dipl.-Päd.
55	RH	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-REICHT_Wolfgang.jpg&w=1200&q=90	Mag.
56	RC	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-REISCHL_Theresa-scaled.jpg&w=1200&q=90	Mag.a
1	GG	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F05%2FABTDIP-GRASSMUGG_Mariagross.jpg&w=1920&q=90	Dipl.-Ing.in Dr.in
40	LR	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIPBSC-LOIBNER_Johannes-scaled.jpg&w=640&q=90	Dipl.-Ing.
41	MF	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-MUeLLERFERLI_Robert-scaled.jpg&w=640&q=90	Dipl.-Ing.
70	SE	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-SENGL_Sonja.jpg&w=1200&q=90	Mag.a
72	SX	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-STEINER_Manfred.jpg&w=1200&q=90	Dipl.-Ing.
73	SN	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-STEINER_Walter.jpg&w=1200&q=90	Dipl.-Ing.
75	SK	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-STROHMEIER_Karin.jpg&w=1200&q=90	Mag.a
76	STR	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FStrohrigl_Robert.jpg&w=1200&q=90	\N
77	TA	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FINGMMA-TAUCHER_Christian.jpg&w=1200&q=90	Ing. MMag.
79	TI	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIPDOC-TIEBER_Johann-scaled.jpg&w=1200&q=90	Dipl.-Ing. Dr.
80	TR	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-TRAUMUeLLER-HAYNALY_Andrea.jpg&w=1200&q=90	Mag.a
81	TRK	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FINGBED-TRKMIC_Esther.jpg&w=1200&q=90	Ing.in
82	UW	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-UNTERWEGER_Reinhard-scaled.jpg&w=1200&q=90	Dipl.-Ing.
84	VO	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-VODOPIUTZ_Wolfgang.jpg&w=1200&q=90	Dipl.-Ing.
85	VK	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-VOeLK_Dietmar.jpg&w=1200&q=90	Dipl.-Ing.
86	VL	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-VOLLERITSCH_Guenter.jpg&w=1200&q=90	Mag.
87	WAI	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FPADBED-WAIKER_Albin.jpg&w=1200&q=90	Dipl.-Päd.
89	WB	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-WEBER_Ferdinand.jpg&w=1200&q=90	Dipl.-Ing.
90	WS	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-WELSER_Martina-scaled.jpg&w=1200&q=90	Mag.a
91	WR	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMAG-WIESLER_Evelyn.jpg&w=1200&q=90	Mag.a
93	WIE	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2024%2F01%2FWIE-WILHELM-scaled.jpg&w=1200&q=90	\N
94	ZWE	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F05%2FZWEYTIK_Kurt.jpg&w=1200&q=90	\N
96	ba	data:image/jpeg;base64,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	mag
98	ab	test	test
7	BA	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FMMADOC-BAUER_Renate-scaled.jpg&w=1200&q=90	MMag.a Dr.in
99	HF		Dr
11	DER	https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FINGBED-DERLER_Karl.jpg&w=1200&q=90	Ing.
\.


--
-- TOC entry 4906 (class 0 OID 0)
-- Dependencies: 217
-- Name: building_building_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.building_building_id_seq', 1, false);


--
-- TOC entry 4907 (class 0 OID 0)
-- Dependencies: 219
-- Name: department_department_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.department_department_id_seq', 1, false);


--
-- TOC entry 4908 (class 0 OID 0)
-- Dependencies: 221
-- Name: person_person_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.person_person_id_seq', 99, true);


--
-- TOC entry 4909 (class 0 OID 0)
-- Dependencies: 223
-- Name: room_room_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.room_room_id_seq', 1, false);


--
-- TOC entry 4910 (class 0 OID 0)
-- Dependencies: 224
-- Name: room_room_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.room_room_id_seq1', 11, true);


--
-- TOC entry 4911 (class 0 OID 0)
-- Dependencies: 227
-- Name: schoolclass_schoolclass_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.schoolclass_schoolclass_id_seq', 1, false);


--
-- TOC entry 4722 (class 2606 OID 102946)
-- Name: address address_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_pk PRIMARY KEY (address_id);


--
-- TOC entry 4724 (class 2606 OID 102958)
-- Name: building building_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.building
    ADD CONSTRAINT building_pk PRIMARY KEY (building_id);


--
-- TOC entry 4726 (class 2606 OID 102965)
-- Name: department department_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department
    ADD CONSTRAINT department_pk PRIMARY KEY (department_id);


--
-- TOC entry 4728 (class 2606 OID 102977)
-- Name: person person_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.person
    ADD CONSTRAINT person_pk PRIMARY KEY (person_id);


--
-- TOC entry 4730 (class 2606 OID 102989)
-- Name: room room_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_pk PRIMARY KEY (room_id);


--
-- TOC entry 4732 (class 2606 OID 103032)
-- Name: school_room school_room_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.school_room
    ADD CONSTRAINT school_room_pk PRIMARY KEY (room_id, teacher_id, valid_from);


--
-- TOC entry 4734 (class 2606 OID 103002)
-- Name: schoolclass schoolclass_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schoolclass
    ADD CONSTRAINT schoolclass_pk PRIMARY KEY (schoolclass_id);


--
-- TOC entry 4736 (class 2606 OID 103008)
-- Name: teacher teacher_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT teacher_pk PRIMARY KEY (teacher_id);


--
-- TOC entry 4737 (class 2606 OID 102947)
-- Name: building building_address_address_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.building
    ADD CONSTRAINT building_address_address_id_fk FOREIGN KEY (address_id) REFERENCES public.address(address_id);


--
-- TOC entry 4738 (class 2606 OID 146235)
-- Name: room room_building_building_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_building_building_id_fk FOREIGN KEY (building_id) REFERENCES public.building(building_id);


--
-- TOC entry 4739 (class 2606 OID 102966)
-- Name: schoolclass schoolclass_department_department_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schoolclass
    ADD CONSTRAINT schoolclass_department_department_id_fk FOREIGN KEY (department_id) REFERENCES public.department(department_id);


--
-- TOC entry 4740 (class 2606 OID 103014)
-- Name: schoolclass schoolclass_teacher_teacher_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schoolclass
    ADD CONSTRAINT schoolclass_teacher_teacher_id_fk FOREIGN KEY (classteacher_id) REFERENCES public.teacher(teacher_id);


--
-- TOC entry 4741 (class 2606 OID 103019)
-- Name: schoolclass schoolclass_teacher_teacher_id_fk_2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schoolclass
    ADD CONSTRAINT schoolclass_teacher_teacher_id_fk_2 FOREIGN KEY (classdeputy_id) REFERENCES public.teacher(teacher_id);


--
-- TOC entry 4742 (class 2606 OID 103009)
-- Name: teacher teacher_person_person_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT teacher_person_person_id_fk FOREIGN KEY (teacher_id) REFERENCES public.person(person_id);


-- Completed on 2025-03-31 09:01:07

--
-- PostgreSQL database dump complete
--

