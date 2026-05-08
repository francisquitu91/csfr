-- Update admision contact information
-- Remove "Casilla 5104 – Correo Reñaca" from address

UPDATE admision_contact
SET address = 'Colegio Sagrada Familia
Parcela 4, Los Pinos, Reñaca'
WHERE name = 'Jennifer Martínez' AND role = 'Encargada de Admisión';
