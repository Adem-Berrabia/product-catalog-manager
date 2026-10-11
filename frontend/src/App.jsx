import { useEffect, useState } from "react";
import {
  getProducts, getProduct, createProduct, updateProduct, deleteProduct,
} from "./api";

const EMPTY = { name: "", description: "", price: "", quantity: "" };

function validate(form) {
  const errs = {};
  const name = form.name.trim();
  if (!name) errs.name = "Le nom est obligatoire.";
  else if (name.length > 100) errs.name = "Le nom ne doit pas dépasser 100 caractères.";

  if (form.price === "" || isNaN(Number(form.price))) errs.price = "Le prix est obligatoire.";
  else if (Number(form.price) < 0) errs.price = "Le prix ne peut pas être négatif.";

  if (form.quantity === "") errs.quantity = "La quantité est obligatoire.";
  else if (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 0)
    errs.quantity = "La quantité doit être un entier positif ou nul.";
  return errs;
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [fieldErrors, setFieldErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async (term = search) => {
    try {
      setProducts(await getProducts(term));
      setError("");
    } catch (e) {
      setError("Impossible de joindre l'API : " + e.message);
    }
  };

  // Recherche avec petit délai (300 ms) pour ne pas appeler l'API à chaque lettre
  useEffect(() => {
    const t = setTimeout(() => load(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const notify = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: undefined });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity, 10),
    };
    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        notify("Produit modifié avec succès.");
      } else {
        await createProduct(payload);
        notify("Produit ajouté avec succès.");
      }
      setForm(EMPTY);
      setEditingId(null);
      setSelected(null);
      setError("");
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const onEdit = (p) => {
    setEditingId(p.id);
    setFieldErrors({});
    setForm({
      name: p.name,
      description: p.description || "",
      price: p.price,
      quantity: p.quantity,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onCancel = () => { setEditingId(null); setForm(EMPTY); setFieldErrors({}); };

  const onDelete = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      await deleteProduct(id);
      if (selected?.id === id) setSelected(null);
      if (editingId === id) onCancel();
      notify("Produit supprimé avec succès.");
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const onView = async (id) => {
    try {
      setSelected(await getProduct(id));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="container">
      <h1>Gestion des produits</h1>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={onSubmit} className="card" noValidate>
        <h2>{editingId ? `Modifier le produit #${editingId}` : "Ajouter un produit"}</h2>

        <input name="name" placeholder="Nom *" value={form.name} onChange={onChange}
               className={fieldErrors.name ? "invalid" : ""} />
        {fieldErrors.name && <div className="field-error">{fieldErrors.name}</div>}

        <textarea name="description" placeholder="Description" value={form.description} onChange={onChange} />

        <div className="row">
          <div className="col">
            <input name="price" type="number" step="0.01" placeholder="Prix *" value={form.price}
                   onChange={onChange} className={fieldErrors.price ? "invalid" : ""} />
            {fieldErrors.price && <div className="field-error">{fieldErrors.price}</div>}
          </div>
          <div className="col">
            <input name="quantity" type="number" placeholder="Quantité *" value={form.quantity}
                   onChange={onChange} className={fieldErrors.quantity ? "invalid" : ""} />
            {fieldErrors.quantity && <div className="field-error">{fieldErrors.quantity}</div>}
          </div>
        </div>

        <div className="row">
          <button type="submit" className="primary">{editingId ? "Enregistrer" : "Ajouter"}</button>
          {editingId && <button type="button" onClick={onCancel}>Annuler</button>}
        </div>
      </form>

      {selected && (
        <div className="card detail">
          <h2>Détails du produit #{selected.id}</h2>
          <p><b>Nom :</b> {selected.name}</p>
          <p><b>Description :</b> {selected.description || "—"}</p>
          <p><b>Prix :</b> {selected.price.toFixed(2)} €</p>
          <p><b>Quantité :</b> {selected.quantity}</p>
          <p><b>Créé le :</b> {selected.created_at ? new Date(selected.created_at).toLocaleString("fr-FR") : "—"}</p>
          <button onClick={() => setSelected(null)}>Fermer</button>
        </div>
      )}

      <div className="card">
        <h2>Liste des produits ({products.length})</h2>
        <input
          className="search"
          placeholder="🔍 Rechercher par nom ou description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {products.length === 0 ? (
          <p>{search ? `Aucun résultat pour « ${search} ».` : "Aucun produit."}</p>
        ) : (
          <table>
            <thead>
              <tr><th>ID</th><th>Nom</th><th>Prix</th><th>Qté</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.price.toFixed(2)} €</td>
                  <td>{p.quantity}</td>
                  <td className="actions">
                    <button onClick={() => onView(p.id)}>Voir</button>
                    <button onClick={() => onEdit(p)}>Modifier</button>
                    <button className="danger" onClick={() => onDelete(p.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
