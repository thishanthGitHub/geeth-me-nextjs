
-- 1. Role system
CREATE TYPE public.app_role AS ENUM ('admin', 'staff');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins view roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. Menu tables
CREATE TABLE public.menu_sections (
  id text PRIMARY KEY,
  title text NOT NULL,
  note text,
  image_key text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id text NOT NULL REFERENCES public.menu_sections(id) ON DELETE CASCADE,
  n integer NOT NULL UNIQUE,
  name text NOT NULL,
  price numeric,
  price_s numeric,
  price_r numeric,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (
    (price IS NOT NULL AND price_s IS NULL AND price_r IS NULL)
    OR (price IS NULL AND price_s IS NOT NULL AND price_r IS NOT NULL)
  )
);

CREATE INDEX idx_menu_items_section ON public.menu_items(section_id, sort_order);

GRANT SELECT ON public.menu_sections TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_sections TO authenticated;
GRANT ALL ON public.menu_sections TO service_role;

GRANT SELECT ON public.menu_items TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_items TO authenticated;
GRANT ALL ON public.menu_items TO service_role;

ALTER TABLE public.menu_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read sections" ON public.menu_sections FOR SELECT USING (true);
CREATE POLICY "Admins write sections" ON public.menu_sections
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public read items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Admins write items" ON public.menu_items
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. Touch trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_menu_sections_touch BEFORE UPDATE ON public.menu_sections
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_menu_items_touch BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 4. Seed sections
INSERT INTO public.menu_sections (id, title, note, image_key, sort_order) VALUES
  ('drinks','Drinks',NULL,'drinks',10),
  ('soup','Soup',NULL,'soup',20),
  ('rice-curry','Rice & Curry',NULL,'rice-curry',30),
  ('sunday','Sunday Special — Rice & Curry',NULL,'sunday',40),
  ('fried-rice','Fried Rice',NULL,'fried-rice',50),
  ('noodles','Noodles',NULL,'noodles',60),
  ('meegoreng','Mee Goreng',NULL,'meegoreng',70),
  ('nasi','Nasi Goreng / Grill Chicken','Seafood, veg salad, fried egg, and chili paste','nasi',80),
  ('spicy-rice','Spicy Rice',NULL,'spicy-rice',90),
  ('koththu','Koththu',NULL,'koththu',100),
  ('cheese-koththu','Cheese Koththu — Geeth Me Special',NULL,'cheese-koththu',110),
  ('prawns','Prawns',NULL,'prawns',120),
  ('crab','Crab',NULL,'crab',130),
  ('chicken','Chicken',NULL,'chicken',140),
  ('beef','Beef',NULL,'beef',150),
  ('deviled','Devilled',NULL,'deviled',160),
  ('omelet','Omelet',NULL,'omelet',170);

-- 5. Seed items (price single or s/r)
INSERT INTO public.menu_items (section_id, n, name, price, price_s, price_r, sort_order) VALUES
  ('drinks',1,'Soft Drinks',100,NULL,NULL,1),
  ('drinks',2,'Mineral Water',160,NULL,NULL,2),
  ('soup',3,'Cream of Vegetable Soup',380,NULL,NULL,1),
  ('soup',4,'Cream of Chicken Soup',500,NULL,NULL,2),
  ('soup',5,'Cream of Mixed Soup',750,NULL,NULL,3),
  ('soup',6,'Sea Food Soup',730,NULL,NULL,4),
  ('rice-curry',7,'Chicken Rice & Curry',450,NULL,NULL,1),
  ('rice-curry',8,'Fish Rice & Curry',380,NULL,NULL,2),
  ('rice-curry',9,'Vegetable Rice & Curry',330,NULL,NULL,3),
  ('rice-curry',10,'Egg Rice & Curry (Omelet)',380,NULL,NULL,4),
  ('rice-curry',11,'Egg Rice & Curry (Bullae)',350,NULL,NULL,5),
  ('sunday',12,'Fish',450,NULL,NULL,1),
  ('sunday',13,'Chicken',550,NULL,NULL,2),
  ('fried-rice',14,'Mixed Fried Rice',NULL,950,1550,1),
  ('fried-rice',15,'Sea Food Fried Rice',NULL,900,1500,2),
  ('fried-rice',16,'Fried Rice with Prawns',NULL,850,1450,3),
  ('fried-rice',17,'Fried Rice with Chicken',NULL,650,1200,4),
  ('fried-rice',18,'Fried Rice with Beef',NULL,750,1350,5),
  ('fried-rice',19,'Fried Rice with Fish',NULL,750,1050,6),
  ('fried-rice',20,'Fried Rice with Egg',NULL,600,900,7),
  ('fried-rice',21,'Fried Rice with Vegetable',NULL,500,800,8),
  ('noodles',22,'Mixed Fried Noodles',NULL,980,1600,1),
  ('noodles',23,'Sea Food Fried Noodles',NULL,950,1550,2),
  ('noodles',24,'Fried Noodles with Prawns',NULL,900,1480,3),
  ('noodles',25,'Fried Noodles with Chicken',NULL,700,1300,4),
  ('noodles',26,'Fried Noodles with Beef',NULL,780,1400,5),
  ('noodles',27,'Fried Noodles with Egg',NULL,630,1080,6),
  ('noodles',28,'Fried Noodles with Vegetable',NULL,550,930,7),
  ('meegoreng',29,'Mixed Mee Goreng',1250,NULL,NULL,1),
  ('meegoreng',30,'Sea Food Mee Goreng',1200,NULL,NULL,2),
  ('meegoreng',31,'Chicken Mee Goreng',900,NULL,NULL,3),
  ('nasi',32,'Mixed Nasi Goreng',1400,NULL,NULL,1),
  ('nasi',33,'Sea Food Nasi Goreng',1350,NULL,NULL,2),
  ('nasi',34,'Chicken Nasi Goreng',1200,NULL,NULL,3),
  ('nasi',35,'Beef Nasi Goreng',1300,NULL,NULL,4),
  ('spicy-rice',36,'Mixed Spicy Rice',1250,NULL,NULL,1),
  ('spicy-rice',37,'Sea Food Spicy Rice',1200,NULL,NULL,2),
  ('spicy-rice',38,'Chicken Spicy Rice',900,NULL,NULL,3),
  ('spicy-rice',39,'Beef Spicy Rice',1050,NULL,NULL,4),
  ('koththu',57,'Mixed Koththu',NULL,950,1550,1),
  ('koththu',58,'Sea Food Koththu',NULL,900,1500,2),
  ('koththu',59,'Chicken Koththu',NULL,650,1200,3),
  ('koththu',60,'Beef Koththu',NULL,750,1350,4),
  ('koththu',61,'Egg Koththu',NULL,480,800,5),
  ('koththu',62,'Vegetable Koththu',NULL,400,750,6),
  ('koththu',63,'Fish Koththu',NULL,750,1350,7),
  ('koththu',64,'Chicken Breast (Boneless)',NULL,750,1350,8),
  ('cheese-koththu',65,'Mixed Cheese Koththu',1450,NULL,NULL,1),
  ('cheese-koththu',66,'Sea Food Cheese Koththu',1400,NULL,NULL,2),
  ('cheese-koththu',67,'Chicken Cheese Koththu',1100,NULL,NULL,3),
  ('cheese-koththu',68,'Beef Cheese Koththu',1200,NULL,NULL,4),
  ('cheese-koththu',69,'Egg Cheese Koththu',900,NULL,NULL,5),
  ('cheese-koththu',70,'Vegetable Cheese Koththu',800,NULL,NULL,6),
  ('cheese-koththu',71,'Fish Cheese Koththu',1300,NULL,NULL,7),
  ('cheese-koththu',72,'Chicken Breast (Boneless) Koththu',1200,NULL,NULL,8),
  ('prawns',91,'Hot Butter Jumbo Prawns',2400,NULL,NULL,1),
  ('prawns',92,'Hot Butter Prawns',1950,NULL,NULL,2),
  ('prawns',93,'Battered Prawns',1950,NULL,NULL,3),
  ('prawns',94,'Fried Prawns',1600,NULL,NULL,4),
  ('prawns',95,'Devilled Prawns',1700,NULL,NULL,5),
  ('prawns',96,'Sri Lankan Prawns Curry',1850,NULL,NULL,6),
  ('crab',97,'Fried Crabs',1650,NULL,NULL,1),
  ('crab',98,'Devilled Crabs',1750,NULL,NULL,2),
  ('crab',99,'Sri Lankan Crabs Curry',1900,NULL,NULL,3),
  ('chicken',100,'Fried Chicken',1250,NULL,NULL,1),
  ('chicken',101,'Devilled Chicken',1300,NULL,NULL,2),
  ('chicken',102,'Black Pepper Chicken',1900,NULL,NULL,3),
  ('beef',103,'Fried Beef',1400,NULL,NULL,1),
  ('beef',104,'Devilled Beef',1500,NULL,NULL,2),
  ('beef',105,'Black Pepper Beef',1750,NULL,NULL,3),
  ('deviled',108,'Mix Devilled',3000,NULL,NULL,1),
  ('deviled',109,'Sea Food Devilled',2800,NULL,NULL,2),
  ('omelet',110,'Sri Lankan Omelet',400,NULL,NULL,1),
  ('omelet',111,'Cheese Omelet',550,NULL,NULL,2),
  ('omelet',112,'Chicken Omelet',550,NULL,NULL,3),
  ('omelet',113,'Spinach & Prawns Omelet',650,NULL,NULL,4);
