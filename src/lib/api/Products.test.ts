import { uploadProductImage, addProduct, NewProduct } from "./products";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";

// Mock Firebase storage and firestore
jest.mock("firebase/storage", () => ({
  ref: jest.fn(),
  uploadBytesResumable: jest.fn(),
  getDownloadURL: jest.fn(),
}));

jest.mock("firebase/firestore", () => ({
  addDoc: jest.fn(),
  collection: jest.fn(),
}));

jest.mock("@/firebase.config", () => ({
  db: {},
  storage: {},
}));

const mockedRef = ref as jest.Mock;
const mockedUploadBytesResumable = uploadBytesResumable as jest.Mock;
const mockedGetDownloadURL = getDownloadURL as jest.Mock;
const mockedAddDoc = addDoc as jest.Mock;
const mockedCollection = collection as jest.Mock;

describe("Products API Utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("uploadProductImage", () => {
    test("successfully uploads file and returns download URL", async () => {
      const mockFile = new File(["test data"], "sofa.png", { type: "image/png" });
      const mockStorageRef = {};
      const mockUrl = "https://firebasestorage.googleapis.com/sofa.png";

      mockedRef.mockReturnValue(mockStorageRef);

      const mockUploadTask = {
        on: jest.fn((event, progress, error, complete) => {
          complete();
        }),
        snapshot: { ref: {} },
      };

      mockedUploadBytesResumable.mockReturnValue(mockUploadTask);
      mockedGetDownloadURL.mockResolvedValue(mockUrl);

      const url = await uploadProductImage(mockFile);

      expect(mockedRef).toHaveBeenCalledWith(expect.anything(), expect.stringContaining("sofa.png"));
      expect(mockedUploadBytesResumable).toHaveBeenCalledWith(mockStorageRef, mockFile);
      expect(mockedGetDownloadURL).toHaveBeenCalled();
      expect(url).toBe(mockUrl);
    });

    test("rejects when upload task encounters an error", async () => {
      const mockFile = new File(["test data"], "sofa.png", { type: "image/png" });
      const uploadError = new Error("Upload failed");

      const mockUploadTask = {
        on: jest.fn((event, progress, error, complete) => {
          error(uploadError);
        }),
        snapshot: { ref: {} },
      };

      mockedUploadBytesResumable.mockReturnValue(mockUploadTask);

      await expect(uploadProductImage(mockFile)).rejects.toThrow("Upload failed");
    });
  });

  describe("addProduct", () => {
    test("uploads image first and then saves product to Firestore collection with imgUrl", async () => {
      const mockFile = new File(["test data"], "sofa.png", { type: "image/png" });
      const mockProduct: NewProduct = {
        productName: "Double Sofa",
        shortDesc: "Comfortable double sofa",
        description: "A great sofa for your living room.",
        category: "sofa",
        price: "200",
      };
      const mockUrl = "https://firebasestorage.googleapis.com/sofa.png";
      const mockCollectionRef = {};

      // Mock successful image upload
      const mockUploadTask = {
        on: jest.fn((event, progress, error, complete) => {
          complete();
        }),
        snapshot: { ref: {} },
      };
      mockedUploadBytesResumable.mockReturnValue(mockUploadTask);
      mockedGetDownloadURL.mockResolvedValue(mockUrl);

      // Mock successful Firestore save
      mockedCollection.mockReturnValue(mockCollectionRef);
      mockedAddDoc.mockResolvedValue({ id: "doc-id-123" });

      await addProduct(mockProduct, mockFile);

      expect(mockedCollection).toHaveBeenCalledWith(expect.anything(), "products");
      expect(mockedAddDoc).toHaveBeenCalledWith(mockCollectionRef, {
        ...mockProduct,
        imgUrl: mockUrl,
      });
    });

    test("does not write to Firestore if image upload fails", async () => {
      const mockFile = new File(["test data"], "sofa.png", { type: "image/png" });
      const mockProduct: NewProduct = {
        productName: "Double Sofa",
        shortDesc: "Comfortable double sofa",
        description: "A great sofa for your living room.",
        category: "sofa",
        price: "200",
      };

      // Mock failed image upload
      const mockUploadTask = {
        on: jest.fn((event, progress, error, complete) => {
          error(new Error("Network failure"));
        }),
        snapshot: { ref: {} },
      };
      mockedUploadBytesResumable.mockReturnValue(mockUploadTask);

      await expect(addProduct(mockProduct, mockFile)).rejects.toThrow("Network failure");
      expect(mockedAddDoc).not.toHaveBeenCalled();
    });
  });
});