from .category import CategoryAdmin
from .choice import ChoiceAdmin
from .size import SizeAdmin, BedSheetsSizeAdmin
from .files import ImageAdmin, VideoAdmin
from .technologies import TechnologyAdmin
from .marker import MarkerAdmin
from .product import create_product_admins
from .stock import StockAdmin
from .stockable import StockableAdmin

create_product_admins()