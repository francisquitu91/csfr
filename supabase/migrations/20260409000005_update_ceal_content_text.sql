-- Update CEAL public text with new approved content
DO $$
DECLARE
  target_id UUID;
BEGIN
  SELECT id INTO target_id
  FROM ceal_content
  ORDER BY created_at ASC
  LIMIT 1;

  IF target_id IS NULL THEN
    INSERT INTO ceal_content (
      title,
      paragraph_1,
      paragraph_2,
      paragraph_3,
      quote_text,
      quote_description,
      signature_text
    ) VALUES (
      'Centro de Alumnos 2025',
      'Este año, como Centro de Alumnos, queremos estar realmente presentes en la vida de cada compañero, acercándonos de distintas formas y generando espacios donde todos se sientan parte. Nuestra intención es aportar con acciones simples pero con sentido, que marquen la diferencia en el día a día y ayuden a que cada alumno, desde su propia esencia, encuentre su lugar dentro de la comunidad SF.',
      'Buscamos fomentar una mayor participación, donde cada uno sea escuchada y valorada, y fortalecer el compañerismo para construir un ambiente más unido y cercano. Queremos que este año se disfrute, dejando recuerdos positivos, momentos compartidos y una huella que acompañe a cada uno más allá del colegio.',
      '',
      'Con motivación avanzamos, del aprendizaje crecemos y en la solidaridad encontramos nuestro sello',
      '',
      'Centro de Alumnos 2025'
    );
  ELSE
    UPDATE ceal_content
    SET
      title = 'Centro de Alumnos 2025',
      paragraph_1 = 'Este año, como Centro de Alumnos, queremos estar realmente presentes en la vida de cada compañero, acercándonos de distintas formas y generando espacios donde todos se sientan parte. Nuestra intención es aportar con acciones simples pero con sentido, que marquen la diferencia en el día a día y ayuden a que cada alumno, desde su propia esencia, encuentre su lugar dentro de la comunidad SF.',
      paragraph_2 = 'Buscamos fomentar una mayor participación, donde cada uno sea escuchada y valorada, y fortalecer el compañerismo para construir un ambiente más unido y cercano. Queremos que este año se disfrute, dejando recuerdos positivos, momentos compartidos y una huella que acompañe a cada uno más allá del colegio.',
      paragraph_3 = '',
      quote_text = 'Con motivación avanzamos, del aprendizaje crecemos y en la solidaridad encontramos nuestro sello',
      quote_description = '',
      signature_text = 'Centro de Alumnos 2025',
      updated_at = TIMEZONE('utc'::text, NOW())
    WHERE id = target_id;
  END IF;
END $$;